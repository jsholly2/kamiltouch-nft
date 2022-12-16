const hre = require("hardhat");

async function main() {
  const KamilTouch = await hre.ethers.getContractFactory("KamilTouch");
  const myNft = await KamilTouch.deploy();

  await myNft.deployed();

  console.log("KamilTouch deployed to:", myNft.address);
  storeContractData(myNft);
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/KamilTouch-address.json",
    JSON.stringify({ KamilTouch: contract.address }, undefined, 2)
  );

  const KamilTouchArtifact = artifacts.readArtifactSync("KamilTouch");

  fs.writeFileSync(
    contractsDir + "/KamilTouch.json",
    JSON.stringify(KamilTouchArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });