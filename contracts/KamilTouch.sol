// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title  KamilTouch NFT Smart Contract
contract KamilTouch is ERC721, ERC721Enumerable, ERC721URIStorage, IERC721Receiver {
    using Counters for Counters.Counter;
    constructor() ERC721("KamilTouch", "KMT") {}
    
    // string private uri = "";

    Counters.Counter private counter;
    
    struct Painting {
        address payable owner;
        string imageUrl;
        uint256 tokenId;
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


    function safeMint(address to, string memory _uri) internal onlyOwner(counter.current()) {
        uint256 _tokenId = counter.current();
        
        _safeMint(to, _tokenId);
        _setTokenURI(_tokenId, _uri);

        counter.increment();
    }

// Function to create a painting providing the
// image url
// price
    function writePainting(
		string memory _imageUrl,
        uint256 _price
    ) public {
        bool _sold = false;
        uint256 _likes = 0;

		paintings[counter.current()] = Painting(
			payable(msg.sender),
			_imageUrl,
            counter.current(),
            _price,
            _likes,
			_sold
		);

        safeMint(msg.sender, _imageUrl);
    }


// Function to buy an uploaded painting using the painting's index
// it sends the money to be paid from the buyer to the owner of the painting
    function buyPainting(uint _index) public payable  {
        uint256 _price = paintings[_index].price;
        bool _sold = paintings[_index].sold;

        require(msg.sender != paintings[_index].owner, "Can't buy your own painting");
        require(!_sold, "Sorry, painting is already sold");
        require(msg.value >= _price, "Invalid painting price");

        address _owner = ownerOf(_index);
        _transfer(_owner, msg.sender, _index);
        paintings[_index].owner.transfer(msg.value);
        paintings[_index].owner = payable(msg.sender);
        paintings[_index].sold = true;
	}


// Function to read an uploaded painting using the index of the painting
    function readPainting(uint _index) public view returns (
        address payable,
		string memory,
		uint256,
        uint256,
        uint256,
		bool
    ) {
        return (
            paintings[_index].owner, 
			paintings[_index].imageUrl, 
			paintings[_index].tokenId,
            paintings[_index].price,
            paintings[_index].likes,
			paintings[_index].sold
        );
    }

// Function to like a painting using the painting's index
    function likePainting(uint _index) public {
        require(!hasLiked[_index][msg.sender], "Already liked");

        paintings[_index].likes++;
        hasLiked[_index][msg.sender] = true;
    }



// The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
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

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) override external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}