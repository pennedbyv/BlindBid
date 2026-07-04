import { JsonRpcProvider, Wallet, Contract, parseEther, formatEther } from "ethers";
import { config } from "../config/env.js";

// Human-readable ABI for ethers.js v6
export const BLIND_BID_AUCTION_ABI = [
  "function createAuction(uint256 vaultId, uint256 reservePrice, uint256 auctionDuration, uint256 estimatedValue, uint8 confidenceScore, string calldata raritySummary) external",
  "function bid(uint256 vaultId) external payable",
  "function endAuction(uint256 vaultId) external",
  "function getAuction(uint256 vaultId) external view returns (tuple(address seller, uint256 currentBid, address highestBidder, uint256 startTime, uint256 lastBidTime, uint256 bidWindow, uint256 auctionDuration, uint256 endTime, bool active, bool ended, uint256 reservePrice))",
  "function getAllAuctions() external view returns (uint256[] memory)",
  "function getAuctionCard(uint256 vaultId) external view returns (string name, string description, bool isLive, bool isEnded, uint256 timeRemaining, uint256 minimumPrice, uint256 estimatedValue, uint8 confidenceScore, string raritySummary, uint256 nftCount)",
  "function getVaultWithAuction(uint256 vaultId) external view returns (string name, string description, tuple(address nftAddress, uint256 tokenId)[] nfts, address seller, uint256 currentBid, address highestBidder, uint256 lastBidTime, bool active, bool ended, uint256 reservePrice)"
];

// Initialize Provider
const provider = new JsonRpcProvider(config.monadRpcUrl);
// Disable request batching to prevent Ankr gateway 'Batch size too large' exceptions
provider.batchMaxCount = 1;

let signer: Wallet | null = null;
if (config.privateKey) {
  const pk = config.privateKey.startsWith("0x") ? config.privateKey : `0x${config.privateKey}`;
  signer = new Wallet(pk, provider);
}

// Get contract instance
export function getAuctionContract(useSigner = true): Contract {
  const contractAddress = config.auctionContractAddress;
  if (!contractAddress) {
    throw new Error("AUCTION_CONTRACT_ADDRESS is not defined in the environment variables");
  }

  const runner = useSigner && signer ? signer : provider;
  return new Contract(contractAddress, BLIND_BID_AUCTION_ABI, runner);
}

/**
 * Standard interface for auction return type
 */
export interface AuctionData {
  seller: string;
  currentBid: string; // formatted in ETH/MON
  highestBidder: string;
  startTime: number;
  lastBidTime: number;
  bidWindow: number;
  auctionDuration: number;
  endTime: number;
  active: boolean;
  ended: boolean;
  reservePrice: string; // formatted in ETH/MON
}

/**
 * Create a new auction on-chain
 */
export async function createAuction(
  vaultId: number,
  reservePrice: string, // in MON/ETH decimal format
  duration: number, // in seconds
  estimatedValue: string, // in MON/ETH decimal format
  confidenceScore: number,
  raritySummary: string
) {
  try {
    const contract = getAuctionContract(true);
    const reservePriceWei = parseEther(reservePrice);
    const estimatedValueWei = parseEther(estimatedValue);

    console.log(`[Blockchain] Creating auction for vault ${vaultId}:`);
    console.log(`  reservePrice: ${reservePrice} MON`);
    console.log(`  duration: ${duration}s`);
    console.log(`  estimatedValue: ${estimatedValue} MON`);
    console.log(`  confidenceScore: ${confidenceScore}`);
    console.log(`  raritySummary: ${raritySummary}`);

    const tx = await contract.createAuction(
      vaultId,
      reservePriceWei,
      duration,
      estimatedValueWei,
      confidenceScore,
      raritySummary
    );

    const receipt = await tx.wait();
    console.log(`[Blockchain] createAuction TX success: ${receipt.hash}`);
    return receipt;
  } catch (error: any) {
    console.error("[Blockchain] Error in createAuction:", error);
    throw new Error(`Blockchain execution failed: ${error.message || error}`);
  }
}

/**
 * Place a bid on an active auction
 * Note: Since backend wallet is the runner, this bids using the backend signer.
 */
export async function placeBid(vaultId: number, bidAmount: string) {
  try {
    const contract = getAuctionContract(true);
    const bidAmountWei = parseEther(bidAmount);

    console.log(`[Blockchain] Bidding on vault ${vaultId} with amount: ${bidAmount} MON`);
    const tx = await contract.bid(vaultId, { value: bidAmountWei });
    const receipt = await tx.wait();
    
    console.log(`[Blockchain] bid TX success: ${receipt.hash}`);
    return receipt;
  } catch (error: any) {
    console.error("[Blockchain] Error in placeBid:", error);
    throw new Error(`Blockchain execution failed: ${error.message || error}`);
  }
}

/**
 * End/settle an auction
 */
export async function endAuction(vaultId: number) {
  try {
    const contract = getAuctionContract(true);
    console.log(`[Blockchain] Ending auction for vault ${vaultId}`);
    
    const tx = await contract.endAuction(vaultId);
    const receipt = await tx.wait();

    console.log(`[Blockchain] endAuction TX success: ${receipt.hash}`);
    return receipt;
  } catch (error: any) {
    console.error("[Blockchain] Error in endAuction:", error);
    throw new Error(`Blockchain execution failed: ${error.message || error}`);
  }
}

/**
 * Fetch basic auction state from the contract
 */
export async function getAuction(vaultId: number): Promise<AuctionData> {
  try {
    const contract = getAuctionContract(false);
    const raw = await contract.getAuction(vaultId);

    return {
      seller: raw[0],
      currentBid: formatEther(raw[1]),
      highestBidder: raw[2],
      startTime: Number(raw[3]),
      lastBidTime: Number(raw[4]),
      bidWindow: Number(raw[5]),
      auctionDuration: Number(raw[6]),
      endTime: Number(raw[7]),
      active: raw[8],
      ended: raw[9],
      reservePrice: formatEther(raw[10]),
    };
  } catch (error: any) {
    console.error(`[Blockchain] Error in getAuction for vault ${vaultId}:`, error);
    throw new Error(`Blockchain query failed: ${error.message || error}`);
  }
}

/**
 * Get all active/historical auction vault IDs
 */
export async function getAllAuctions(): Promise<number[]> {
  try {
    const contract = getAuctionContract(false);
    const rawIds: bigint[] = await contract.getAllAuctions();
    return rawIds.map((id) => Number(id));
  } catch (error: any) {
    console.error("[Blockchain] Error in getAllAuctions:", error);
    throw new Error(`Blockchain query failed: ${error.message || error}`);
  }
}

export interface AuctionCardData {
  vaultId: number;
  name: string;
  description: string;
  isLive: boolean;
  isEnded: boolean;
  timeRemaining: number;
  minimumPrice: string;
  estimatedValue: string;
  confidenceScore: number;
  raritySummary: string;
  nftCount: number;
}

/**
 * Fetch simplified card details for rendering lists of auctions.
 */
export async function getAuctionCard(vaultId: number): Promise<AuctionCardData> {
  try {
    const contract = getAuctionContract(false);
    const raw = await contract.getAuctionCard(vaultId);

    return {
      vaultId,
      name: raw[0],
      description: raw[1],
      isLive: raw[2],
      isEnded: raw[3],
      timeRemaining: Number(raw[4]),
      minimumPrice: formatEther(raw[5]),
      estimatedValue: formatEther(raw[6]),
      confidenceScore: Number(raw[7]),
      raritySummary: raw[8],
      nftCount: Number(raw[9]),
    };
  } catch (error: any) {
    console.error(`[Blockchain] Error in getAuctionCard for vault ${vaultId}:`, error);
    throw new Error(`Blockchain query failed: ${error.message || error}`);
  }
}

export interface NFTItem {
  nftAddress: string;
  tokenId: number;
}

export interface VaultWithAuctionData {
  name: string;
  description: string;
  nfts: NFTItem[];
  seller: string;
  currentBid: string;
  highestBidder: string;
  lastBidTime: number;
  active: boolean;
  ended: boolean;
  reservePrice: string;
}

/**
 * Fetch complete vault and auction details (restricted on-chain).
 */
export async function getVaultWithAuction(vaultId: number): Promise<VaultWithAuctionData> {
  try {
    // We use the signer (operator) so we can query full NFT list at any time
    const contract = getAuctionContract(true);
    const raw = await contract.getVaultWithAuction(vaultId);

    const rawNfts: any[] = raw[2];
    const nfts: NFTItem[] = rawNfts.map((nft) => ({
      nftAddress: nft[0],
      tokenId: Number(nft[1]),
    }));

    return {
      name: raw[0],
      description: raw[1],
      nfts,
      seller: raw[3],
      currentBid: formatEther(raw[4]),
      highestBidder: raw[5],
      lastBidTime: Number(raw[6]),
      active: raw[7],
      ended: raw[8],
      reservePrice: formatEther(raw[9]),
    };
  } catch (error: any) {
    console.error(`[Blockchain] Error in getVaultWithAuction for vault ${vaultId}:`, error);
    throw new Error(`Blockchain query failed: ${error.message || error}`);
  }
}
