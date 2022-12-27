// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title  KamilTouch NFT Smart Contract
contract KamilTouch is ERC721, ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;
    constructor() ERC721("KamilTouch", "KMT") {}

    Counters.Counter private counter;
    
    struct Painting {
        address payable owner;
        string imageUrl;
        uint256 price;
        uint256 likes;
        bool sold;
    }
    
    mapping (uint => Painting) internal paintings;
    mapping (uint => mapping(address => bool)) hasLiked;

    modifier onlyOwner(uint256 _index) {
        require(msg.sender == paintings[_index].owner, "Only owner can mint an NFT");
        _;
    }


    /**
        * @notice Function to create a painting providing the
        * @param _imageUrl token's uri
        * @param _price selling price of token
     */
    function writePainting(
		string calldata _imageUrl,
        uint256 _price
    ) public {
        bool _sold = false;
        uint256 _likes = 0;
        uint256 _tokenId = counter.current();

        counter.increment();

		paintings[_tokenId] = Painting(
			payable(msg.sender),
			_imageUrl,
            _price,
            _likes,
			_sold
		);
        
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _imageUrl);
    }


    /**
        * @dev the selling price is transferred from the buyer to the owner/seller of the painting
        * @notice Function to buy an uploaded painting using the painting's index
    */
    function buyPainting(uint _tokenId) public payable  {
        Painting storage currentPainting = paintings[_tokenId];
        require(msg.sender != currentPainting.owner, "Can't buy your own painting");
        require(!currentPainting.sold, "Sorry, painting is already sold");
        require(msg.value == currentPainting.price, "Invalid painting price");
        
        address _owner = currentPainting.owner;
        currentPainting.owner = payable(msg.sender);
        currentPainting.sold = true;

        _transfer(_owner, msg.sender, _tokenId);

        (bool success,) = payable(_owner).call{value:msg.value}("");
        require(success, "Transfer failed");
        
	}


    /// @notice Function to read an uploaded painting using the tokenId of the painting
    function readPainting(uint _tokenId) public view returns (Painting memory) {
        return paintings[_tokenId];
    }

    /// @notice Function to like a painting using the painting's tokenId
    function likePainting(uint _tokenId) public {
        require(_exists(_tokenId), "NFT doesn't exist");
        require(!hasLiked[_tokenId][msg.sender], "Already liked");

        paintings[_tokenId].likes++;
        hasLiked[_tokenId][msg.sender] = true;
    }



    // The following functions are overrides required by Solidity.

    /**
     * @dev See {IERC721-transferFrom}.
     * Changes is made to transferFrom to keep track and update the owner value in paintings
     */
    function transferFrom(
        address from,
        address to,
        uint256 _tokenId
    ) public override {
        paintings[_tokenId].owner = payable(to);
        super.transferFrom(from, to, _tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     * Changes is made to safeTransferFrom to keep track and update the owner value in paintings
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 _tokenId,
        bytes memory data
    ) public override {
        paintings[_tokenId].owner = payable(to);
        _safeTransfer(from, to, _tokenId, data);
    }



    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}
