import { Router } from "express";
import { BiddingController } from "../controllers/bidding.js";
import { validateRegisterNickname, validatePlaceBid } from "../middleware/validation.js";

const router = Router();
const biddingController = new BiddingController();

// Bind routes with middleware validation
router.post("/auction/:id/register", validateRegisterNickname, (req, res) => biddingController.registerNickname(req, res));
router.post("/auction/:id/bid", validatePlaceBid, (req, res) => biddingController.placeBid(req, res));
router.get("/auction/:id/bids", (req, res) => biddingController.getBids(req, res));

export default router;
