import { endAuction } from "../blockchain/client.js";
import { io } from "../index.js";
import { biddingService } from "../controllers/bidding.js";

/**
 * Service managing the 60-second blitz auction timer state.
 * Isolated from core blockchain execution so it can be independently configured.
 */
export class BlitzTimerService {
  // Key: auctionId -> Value: NodeJS.Timeout
  private activeTimers = new Map<number, NodeJS.Timeout>();

  /**
   * Registers and starts a 60-second blitz countdown for an auction.
   */
  public startBlitzTimer(auctionId: number): void {
    if (this.activeTimers.has(auctionId)) {
      console.warn(`[BlitzTimer] Timer already active for auction ${auctionId}`);
      return;
    }

    console.log(`[BlitzTimer] Starting 60s countdown for auction ${auctionId}...`);
    
    // Broadcast blitz-started
    io.emit("blitz-started", {
      auctionId,
      timeLimit: 60,
      timestamp: Date.now(),
    });

    const timeout = setTimeout(async () => {
      await this.handleTimerExpiry(auctionId);
    }, 60 * 1000);

    this.activeTimers.set(auctionId, timeout);
  }

  /**
   * Handles first bid placement logic for an auction.
   * Cancels the auto-close countdown.
   */
  public handleFirstBid(auctionId: number): void {
    if (this.activeTimers.has(auctionId)) {
      console.log(`[BlitzTimer] First bid received for auction ${auctionId}. Cancelling countdown.`);
      
      // Clear the timeout to prevent automatic closure
      clearTimeout(this.activeTimers.get(auctionId)!);
      this.activeTimers.delete(auctionId);

      // Emit tracking events
      io.emit("first-bid-received", { auctionId, timestamp: Date.now() });
      io.emit("auction-continued", { auctionId });
    }
  }

  /**
   * Handles auction cancellation (clears timer)
   */
  public handleCancellation(auctionId: number): void {
    if (this.activeTimers.has(auctionId)) {
      console.log(`[BlitzTimer] Auction ${auctionId} cancelled. Clearing timer.`);
      clearTimeout(this.activeTimers.get(auctionId)!);
      this.activeTimers.delete(auctionId);
      
      io.emit("auction-cancelled", { auctionId });
    }
  }

  /**
   * Internal timeout executor: settles the auction if no bids have arrived
   */
  private async handleTimerExpiry(auctionId: number): Promise<void> {
    console.log(`[BlitzTimer] Timer expired for auction ${auctionId}`);
    this.activeTimers.delete(auctionId);

    const bids = biddingService.getBidHistory(auctionId);
    
    if (bids.length === 0) {
      console.log(`[BlitzTimer] No bids placed. Initiating on-chain auto-closure...`);
      try {
        // Trigger on-chain settle event to return NFTs to the seller
        await endAuction(auctionId);
        
        io.emit("blitz-expired", { auctionId, timestamp: Date.now() });
        io.emit("auction-ended", {
          vaultId: auctionId,
          winnerNickname: "No bids placed (Blitz Expiry)",
          finalPrice: "0",
        });
      } catch (err: any) {
        console.error(`[BlitzTimer] Failed to auto-settle auction ${auctionId} on expiry:`, err.message || err);
      }
    } else {
      console.log(`[BlitzTimer] Bids already present. Permitting auction continuation.`);
      io.emit("auction-continued", { auctionId });
    }
  }
}

// Export singleton instance of BlitzTimerService for application-wide registry access
export const blitzTimerService = new BlitzTimerService();
