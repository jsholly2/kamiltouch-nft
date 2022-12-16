import {Web3Storage} from 'web3.storage/dist/bundle.esm.min.js'
import { ethers } from "ethers";

function getAccessToken () {
  return process.env.REACT_APP_STORAGE_API_KEY
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() })
}

const client = makeStorageClient();

const uploadFile = (file) => {
  const file_cid = client.put(file);
  return file_cid;
}


export const createNft = async (
  minterContract,
  performActions,
  { artName, artistName, description, ipfsImage, category, price, ownerAddress }
) => {

  await performActions(async (kit) => {
    if (!artName || !description || !ipfsImage || !artistName || !category || !price) return;
    const { defaultAccount } = kit;

    // convert NFT metadata to JSON format
    const data = JSON.stringify({
      artName,
      artistName,
      description,
      category,
      image: ipfsImage,
    });

    try {
      // editing file name
      let name = artName.trim();
      if(name.includes(" ")) {
        name = name.replaceAll(" ", "%20");
      }

      // save NFT metadata to IPFS
      const blobFile = new Blob([data], { type: 'application/json' });
      const files = [ new File([blobFile], `${artName}`) ];

      const fileCid = await uploadFile(files);

      // IPFS url for uploaded metadata
      const url = `https://${fileCid}.ipfs.w3s.link/${name}`
      const _price = ethers.utils.parseUnits(String(price), "ether");

      // mint the NFT and save the IPFS url to the blockchain
      const transaction = await minterContract.methods
        .writePainting(url, _price)
        .send({ from: defaultAccount });

      return transaction;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  });
};

export const uploadFileToWebStorage = async (e) => {
  // Construct with token and endpoint
  const file = e.target.files;
  const name = e.target.files[0].name;

  let imageName = name.trim();
  if(imageName.includes(" ")) {
    imageName = imageName.replaceAll(" ", "%20");
  }
  if (!file) return;
  // Pack files into a CAR and send to web3.storage
  const rootCid = await client.put(file) // Promise<CIDString>
  return `https://${rootCid}.ipfs.w3s.link/${imageName}`
};

export const getNfts = async (minterContract) => {
  try {
    const nfts = [];
    const nftsLength = await minterContract.methods.totalSupply().call();
    for (let i = 0; i < Number(nftsLength); i++) {
      const nft = new Promise(async (resolve) => {
        const res = await minterContract.methods.tokenURI(i).call();
        const meta = await fetchNftMeta(res);
        const kamiltouch = await minterContract.methods.readPainting(i).call();
        resolve({
          index: i,
          owner: kamiltouch[0],
          artName: meta.artName,
          artistName: meta.artistName,
          image: meta.image,
          description: meta.description,
          price: kamiltouch[3],
          category: meta.category,
          sold: kamiltouch[5],
          likes: kamiltouch[4]
        });
      });
      nfts.push(nft);
    }
    return Promise.all(nfts);
  } catch (e) {
    console.log({ e });
  }
};

export const fetchNftMeta = async (ipfsUrl) => {
  try {
    if (!ipfsUrl) return null;
    const data = await fetch(ipfsUrl);
    const meta = await data.json();

    return meta;
  } catch (e) {
    console.log({ e });
  }
};

export const buyNft = async (minterContract, performActions, tokenId) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      const kamiltouch = await minterContract.methods.readPainting(tokenId).call();
      await minterContract.methods.buyPainting(tokenId).send({ from: defaultAccount, value: kamiltouch[3]})
    })
  } catch (e) {
    console.log({ e })
  }
}

export const likeNft = async (minterContract, performActions, tokenId) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await minterContract.methods.likePainting(tokenId).send({ from: defaultAccount });
    })
  } catch (e) {
    alert("Sorry, you can only like once")
    console.log({ e })
  }
}