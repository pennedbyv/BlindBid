import { placeBid, getAuction } from "../blockchain/client.js";
import { broadcastBidPlaced } from "./socket.js";
import { blitzTimerService } from "./timer.js";

export interface BidRecord {
  nickname: string;
  amount: string;
  timestamp: number;
}

export interface Registration {
  auctionId: number;
  walletAddress: string;
  nickname: string;
}

/**
 * Service managing in-memory nickname registrations and bid histories.
 * Decoupled from persistent DB for hackathon-speed execution.
 */
export class BiddingService {
  // Key: `${auctionId}-${walletAddress.toLowerCase()}` -> Value: nickname
  private registrations = new Map<string, string>();

  // Key: auctionId -> Value: Set of taken nicknames
  private takenNicknames = new Map<number, Set<string>>();

  // Key: auctionId -> Value: array of bids
  private bidHistories = new Map<number, BidRecord[]>();

  /**
   * Registers a wallet address with a nickname for a specific auction.
   */
  public registerNickname(auctionId: number, walletAddress: string, nickname: string): void {
    const walletLower = walletAddress.toLowerCase().trim();
    const nickTrimmed = nickname.trim();

    // Initialize set of nicknames for this auction if it doesn't exist
    if (!this.takenNicknames.has(auctionId)) {
      this.takenNicknames.set(auctionId, new Set<string>());
    }

    const takenSet = this.takenNicknames.get(auctionId)!;

    // Check if this wallet is already registered in this auction
    const regKey = `${auctionId}-${walletLower}`;
    const existingNick = this.registrations.get(regKey);
    
    if (existingNick) {
      if (existingNick.toLowerCase() === nickTrimmed.toLowerCase()) {
        // Already registered with same nickname, do nothing
        return;
      }
      // If updating nickname, remove the old one from the taken set
      takenSet.delete(existingNick.toLowerCase());
    }

    // Verify nickname is unique within this auction
    if (takenSet.has(nickTrimmed.toLowerCase())) {
      throw new Error(`Nickname "${nickTrimmed}" is already taken for this auction`);
    }

    // Store registration
    this.registrations.set(regKey, nickTrimmed);
    takenSet.add(nickTrimmed.toLowerCase());

    console.log(`[BiddingService] Registered "${nickTrimmed}" for wallet ${walletLower} on auction ${auctionId}`);
  }

  /**
   * Retrieves nickname for a wallet on a specific auction.
   */
  public getNickname(auctionId: number, walletAddress: string): string | null {
    const regKey = `${auctionId}-${walletAddress.toLowerCase().trim()}`;
    return this.registrations.get(regKey) || null;
  }

  /**
   * Places a bid on-chain and records it in the in-memory history.
   */
  public async submitBid(auctionId: number, walletAddress: string, bidAmount: string): Promise<BidRecord> {
    const nickname = this.getNickname(auctionId, walletAddress);
    if (!nickname) {
      throw new Error("Wallet not registered for this auction. Please set a nickname first.");
    }

    // Call the blockchain layer to send the bid transaction
    const receipt = await placeBid(auctionId, bidAmount);

    const record: BidRecord = {
      nickname,
      amount: bidAmount,
      timestamp: Date.now(),
    };

    // Store in history
    if (!this.bidHistories.has(auctionId)) {
      this.bidHistories.set(auctionId, []);
    }
    this.bidHistories.get(auctionId)!.push(record);

    console.log(`[BiddingService] Bid of ${bidAmount} MON by ${nickname} recorded for auction ${auctionId}`);

    // If this is the first bid, cancel the blitz timer
    const history = this.bidHistories.get(auctionId)!;
    if (history.length === 1) {
      blitzTimerService.handleFirstBid(auctionId);
    }

    // Fetch updated time remaining directly from block state
    const auctionData = await getAuction(auctionId);
    const timeRemaining = Math.max(0, auctionData.endTime - Math.floor(Date.now() / 1000));

    // Push realtime Socket.io notification for dashboard updates
    broadcastBidPlaced({
      vaultId: auctionId,
      nickname,
      amount: bidAmount,
      timeRemaining,
    });

    return record;
  }

  /**
   * Fetches the bid history for a specific auction.
   */
  public getBidHistory(auctionId: number): BidRecord[] {
    const history = this.bidHistories.get(auctionId) || [];
    // Return sorted descending (newest bids first)
    return [...history].sort((a, b) => b.timestamp - a.timestamp);
  }
}
