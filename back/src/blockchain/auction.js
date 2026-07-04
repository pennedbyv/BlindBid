// Blockchain interaction layer — creates auctions on-chain via ethers.js
// This is the tool the AI agent calls to deploy auctions to Monad testnet

import { ethers } from "ethers";

/**
 * Create an auction on the BlindBidAuction smart contract.
 * Called by the AI agent's createAuction tool.
 */
export async function createAuctionOnChain({
  reservePrice,
  duration,
  nftTokenIds,
  reasoning,
}) {
  const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const contractAddress = process.env.AUCTION_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("AUCTION_CONTRACT_ADDRESS not set in environment");
  }

  // ABI will be populated after contract compilation
  const abi = [
    "function createAuction(uint256[] calldata tokenIds, uint256 reservePrice, uint256 duration) external returns (uint256)",
  ];

  const contract = new ethers.Contract(contractAddress, abi, wallet);

  const reservePriceWei = ethers.parseEther(reservePrice);

  console.log(`[Blockchain] Creating auction...`);
  console.log(`  Reserve Price: ${reservePrice} MON`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  NFT Token IDs: ${nftTokenIds.join(", ")}`);
  console.log(`  Reasoning: ${reasoning}`);

  const tx = await contract.createAuction(
    nftTokenIds,
    reservePriceWei,
    duration
  );
  const receipt = await tx.wait();

  console.log(`[Blockchain] Auction created! TX: ${receipt.hash}`);

  return {
    success: true,
    transactionHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    reservePrice,
    duration,
    nftTokenIds,
    reasoning,
  };
}
