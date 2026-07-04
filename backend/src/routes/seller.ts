import { Router } from "express";
import { SellerController } from "../controllers/seller.js";
import { validateCreateAuction } from "../middleware/validation.js";

const router = Router();
const sellerController = new SellerController();

// Bind route with validation middleware
router.post("/create-auction", validateCreateAuction, (req, res) => sellerController.createAuction(req, res));

export default router;
