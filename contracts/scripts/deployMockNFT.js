const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying MockNFT with account:", deployer.address);

  const MockNFT = await hre.ethers.getContractFactory("MockNFT");
  const mockNFT = await MockNFT.deploy();

  await mockNFT.waitForDeployment();
  const mockNFTAddress = await mockNFT.getAddress();
  console.log("MockNFT deployed to:", mockNFTAddress);

  // Mint 5 NFTs to the deployer address for testing
  console.log("Minting 5 mock NFTs to deployer...");
  for (let i = 0; i < 5; i++) {
    const tx = await mockNFT.mint(deployer.address);
    await tx.wait();
    console.log(`Minted NFT #${i}`);
  }

  console.log("Deployment and minting completed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
