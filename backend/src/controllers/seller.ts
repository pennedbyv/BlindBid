import { Request, Response } from "express";
import { SellerService } from "../services/seller.js";

const sellerService = new SellerService();

/**
 * Controller for Seller request-response flows.
 */
export class SellerController {
  /**
   * Handler for POST /seller/create-auction
   */
  public async createAuction(req: Request, res: Response) {
    try {
      const { vaultId, sellerGoal, nftBundle, marketContext, socketId } = req.body;

      console.log(`[SellerController] Received create-auction request for vault: ${vaultId} (Socket: ${socketId || "none"})`);

      const result = await sellerService.strategizeAndDeploy({
        vaultId: Number(vaultId),
        sellerGoal,
        nftBundle,
        marketContext,
        socketId,
      });

      return res.status(201).json({
        success: true,
        data: {
          auctionId: result.vaultId,
          reservePrice: result.reservePrice,
          duration: result.duration,
          reasoning: result.reasoningSteps,
          strategy: result.strategy,
          transactionHash: result.transactionHash,
          blockNumber: result.blockNumber,
        },
      });
    } catch (error: any) {
      console.error("[SellerController] Error in createAuction:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to strategize and deploy auction",
      });
    }
  }
}
