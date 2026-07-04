import { Request, Response } from "express";
import { BiddingService } from "../services/bidding.js";

const biddingService = new BiddingService();

export class BiddingController {
  /**
   * Handler for POST /auction/:id/register
   */
  public registerNickname(req: Request, res: Response) {
    try {
      const auctionId = Number(req.params.id);
      const { walletAddress, nickname } = req.body;

      biddingService.registerNickname(auctionId, walletAddress, nickname);

      return res.status(200).json({
        success: true,
        message: `Registered as "${nickname}" successfully`,
        data: { auctionId, walletAddress, nickname },
      });
    } catch (error: any) {
      console.error("[BiddingController] Error in registerNickname:", error);
      return res.status(400).json({
        success: false,
        error: error.message || "Failed to register nickname",
      });
    }
  }

  /**
   * Handler for POST /auction/:id/bid
   */
  public async placeBid(req: Request, res: Response) {
    try {
      const auctionId = Number(req.params.id);
      const { walletAddress, bidAmount } = req.body;

      const record = await biddingService.submitBid(auctionId, walletAddress, bidAmount);

      return res.status(201).json({
        success: true,
        message: "Bid placed successfully",
        data: record,
      });
    } catch (error: any) {
      console.error("[BiddingController] Error in placeBid:", error);
      return res.status(400).json({
        success: false,
        error: error.message || "Failed to submit bid",
      });
    }
  }

  /**
   * Handler for GET /auction/:id/bids
   */
  public getBids(req: Request, res: Response) {
    try {
      const auctionId = Number(req.params.id);
      const bids = biddingService.getBidHistory(auctionId);

      return res.status(200).json({
        success: true,
        data: bids,
      });
    } catch (error: any) {
      console.error("[BiddingController] Error in getBids:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to retrieve bid history",
      });
    }
  }
}

// Export the bidding service instance so other services can resolve nicknames if needed (like the Auction summary)
export { biddingService };
