const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KamilTouch", function () {
  this.timeout(50000);

  it("Should upload art art work and mint to the correct owner", async function () {

    const KamilTouch = await ethers.getContractFactory("KamilTouch");
    const [owner] = await ethers.getSigners();
    const imageUrl = "https://example.com";
    const price = 1;

    const myNFT = await KamilTouch.deploy();
    
    const tx = await myNFT.connect(owner).writePainting(imageUrl, price);
    await tx.wait();

    expect(await myNFT.totalSupply()).to.equal(1);
    expect(await myNFT.ownerOf(0)).to.equal(owner.address);
  });

  it("Should successfully like a painting", async function() {
    const KamilTouch = await ethers.getContractFactory("KamilTouch");
    const[owner] = await ethers.getSigners();

    const myNFT = await KamilTouch.deploy();

    const tx = await myNFT.connect(owner).likePainting(0);
    const tx2 = await myNFT.readPainting(0);
    await tx.wait();

    expect(await tx2[4]).to.equal(1);
  })
});