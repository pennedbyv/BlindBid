import {
  getAllAuctions,
  getAuctionCard,
  getVaultWithAuction,
  getAuction,
  AuctionCardData,
  VaultWithAuctionData,
  AuctionData
} from "../blockchain/client.js";
import { biddingService } from "../controllers/bidding.js";

export interface BlindAuctionSummary {
  vaultId: number;
  bundleSize: number;
  estimatedValue: string;
  aiConfidence: number;
  rarityDistribution: string;
  collectionTheme: string;
  reservePrice: string;
  timeRemaining: number;
  status: "active" | "ended" | "cancelled" | "inactive";
  highestBid: string;
  highestBidderNickname: string;
}

/**
 * Deterministically generates a funny nickname/alias for any Ethereum address
 * to add high interactivity to the hackathon demo without needing a database.
 */
export function generateNickname(address: string): string {
  if (!address || address === "0x0000000000000000000000000000000000000000") {
    return "No bids placed";
  }

  const adjectives = [
    "Blitz", "Hyper", "Fast", "Parallel", "Giga", "Mega", "Sonic", "Crypto", 
    "Monad", "Cyber", "DeFi", "Epic", "Golden", "Shadow", "Alpha", "Rapid"
  ];
  const nouns = [
    "Hustler", "Ape", "Runner", "Bull", "Gwei", "Sniper", "Whale", "Ninja", 
    "Degen", "Nomad", "Wizard", "Knight", "Ranger", "Titan", "Agent", "Slayer"
  ];

  const cleanAddress = address.toLowerCase().replace("0x", "");
  const hash = cleanAddress.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const adj = adjectives[hash % adjectives.length];
  const noun = nouns[(hash * 3 + 7) % nouns.length];
  const shortAddr = address.substring(0, 6) + "..." + address.substring(address.length - 4);

  return `${adj} ${noun} (${shortAddr})`;
}

export class AuctionService {
  /**
   * Returns a card summary of all auctions in the system.
   */
  public async getAuctionsList(): Promise<AuctionCardData[]> {
    console.log("[AuctionService] Fetching all auctions list...");
    const vaultIds = await getAllAuctions();

    const cards: AuctionCardData[] = [];
    for (const id of vaultIds) {
      try {
        const card = await getAuctionCard(id);
        cards.push(card);
      } catch (err) {
        console.error(`[AuctionService] Error fetching card for vault ${id}:`, err);
        // Continue, skip corrupted/missing vaults
      }
    }
    return cards;
  }

  /**
   * Returns full, detailed information of a vault + auction.
   * On-chain smart contract will revert this check unless the caller is the seller/operator OR if the auction is ended.
   */
  public async getAuctionDetails(vaultId: number): Promise<VaultWithAuctionData> {
    console.log(`[AuctionService] Fetching details for vault ${vaultId}...`);
    return await getVaultWithAuction(vaultId);
  }

  /**
   * Returns the blind summary of the auction (strictly keeping NFT identities hidden).
   */
  public async getAuctionBlindSummary(vaultId: number): Promise<BlindAuctionSummary> {
    console.log(`[AuctionService] Fetching blind summary for vault ${vaultId}...`);
    
    // Fetch auction details and card (includes preview details) in parallel
    const [card, auction] = await Promise.all([
      getAuctionCard(vaultId),
      getAuction(vaultId)
    ]);

    // Parse status
    let status: "active" | "ended" | "cancelled" | "inactive" = "inactive";
    if (auction.active) {
      status = "active";
    } else if (auction.ended) {
      status = "ended";
    }

    return {
      vaultId,
      bundleSize: card.nftCount,
      estimatedValue: card.estimatedValue,
      aiConfidence: card.confidenceScore,
      rarityDistribution: card.raritySummary,
      collectionTheme: card.name || "Mystery Monad Bundle",
      reservePrice: card.minimumPrice,
      timeRemaining: card.timeRemaining,
      status,
      highestBid: auction.currentBid,
      highestBidderNickname: biddingService.getNickname(vaultId, auction.highestBidder) || generateNickname(auction.highestBidder),
    };
  }
}
