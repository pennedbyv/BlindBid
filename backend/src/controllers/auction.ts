import { Request, Response } from "express";
import { AuctionService } from "../services/auction.js";

const auctionService = new AuctionService();

export class AuctionController {
  /**
   * Handler for GET /auctions
   */
  public async listAuctions(req: Request, res: Response) {
    try {
      const data = await auctionService.getAuctionsList();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error("[AuctionController] Error in listAuctions:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch auctions",
      });
    }
  }

  /**
   * Handler for GET /auction/:id
   */
  public async getAuctionDetails(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await auctionService.getAuctionDetails(id);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error(`[AuctionController] Error in getAuctionDetails for id ${req.params.id}:`, error);
      // Revert from EVM is mapped and returned clearly
      return res.status(403).json({
        success: false,
        error: error.message || "Access denied. Auction might not be ended yet.",
      });
    }
  }

  /**
   * Handler for GET /auction/:id/summary
   */
  public async getAuctionSummary(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await auctionService.getAuctionBlindSummary(id);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error(`[AuctionController] Error in getAuctionSummary for id ${req.params.id}:`, error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch auction summary",
      });
    }
  }
}
