import { Router, Request, Response, NextFunction } from "express";
import { AuctionController } from "../controllers/auction.js";

const router = Router();
const auctionController = new AuctionController();

/**
 * Middleware to validate auction ID param
 */
function validateAuctionIdParam(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);

  if (isNaN(id) || id < 0) {
    return res.status(400).json({
      success: false,
      error: "Invalid parameter: auction ID must be a non-negative number",
    });
  }

  next();
}

// Bind routes
router.get("/auctions", (req, res) => auctionController.listAuctions(req, res));
router.get("/auction/:id", validateAuctionIdParam, (req, res) => auctionController.getAuctionDetails(req, res));
router.get("/auction/:id/summary", validateAuctionIdParam, (req, res) => auctionController.getAuctionSummary(req, res));

export default router;
