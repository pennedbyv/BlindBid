// AI routes — API endpoints for the AI Auction Strategist

import { Router } from "express";
import { runStrategist } from "../ai/strategist.js";
import { executeToolCall } from "../ai/tools.js";

const router = Router();

/**
 * POST /api/ai/strategize
 * Body: { sellerGoal, nftBundle, collectionInfo }
 * Returns: AI reasoning + auction creation result
 */
router.post("/strategize", async (req, res) => {
  try {
    const { sellerGoal, nftBundle, collectionInfo } = req.body;

    if (!sellerGoal || !nftBundle) {
      return res.status(400).json({ error: "sellerGoal and nftBundle are required" });
    }

    // Step 1: Run the AI strategist
    const response = await runStrategist({ sellerGoal, nftBundle, collectionInfo });
    const message = response.choices[0].message;

    // Step 2: Extract reasoning text
    const reasoning = message.content || "";

    // Step 3: Check if AI made a tool call
    let auctionResult = null;
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      auctionResult = await executeToolCall(toolCall);
    }

    res.json({
      reasoning,
      auctionResult,
      toolCalls: message.tool_calls || [],
    });
  } catch (error) {
    console.error("[AI Route] Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
