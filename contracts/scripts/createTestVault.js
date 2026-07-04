const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Preparing to create test vault with account:", deployer.address);

  const auctionAddress = process.env.AUCTION_CONTRACT_ADDRESS;
  const nftAddress = process.env.NFT_CONTRACT_ADDRESS;

  console.log("Auction Contract:", auctionAddress);
  console.log("NFT Contract:", nftAddress);

  if (!auctionAddress || !nftAddress) {
    throw new Error("Contract addresses not found in env");
  }

  const nft = await hre.ethers.getContractAt("MockNFT", nftAddress);
  const auction = await hre.ethers.getContractAt("BlindBidAuction", auctionAddress);

  // Mint 3 fresh NFTs dynamically to guarantee ownership
  const tokenIds = [];
  console.log("Minting 3 fresh NFTs to deployer...");
  for (let i = 0; i < 3; i++) {
    const tx = await nft.mint(deployer.address);
    const receipt = await tx.wait();
    // Parse TokenId from Transfer event
    const log = receipt.logs[0];
    const tokenId = hre.ethers.toNumber(log.topics[3]);
    tokenIds.push(tokenId);
    console.log(`Minted NFT #${tokenId}`);
  }

  // Approve the newly minted NFTs for the Auction contract
  console.log(`Approving NFTs ${tokenIds.join(", ")} for the Auction contract...`);
  for (const id of tokenIds) {
    const approveTx = await nft.approve(auctionAddress, id);
    await approveTx.wait();
    console.log(`Approved NFT #${id}`);
  }

  // Create vault
  console.log("Creating vault on-chain...");
  const createVaultTx = await auction.createVault(
    [nftAddress, nftAddress, nftAddress],
    tokenIds,
    "Elite Mojo Dragon Bundle",
    "A legendary pack of Mojo Dragons and Badges."
  );

  const receipt = await createVaultTx.wait();
  
  // Retrieve vaultCount to see the created ID
  const vaultCount = await auction.vaultCount();
  const vaultId = Number(vaultCount) - 1;

  console.log(`Vault successfully created! Vault ID: ${vaultId}`);
  console.log(`Transaction Hash: ${receipt.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
