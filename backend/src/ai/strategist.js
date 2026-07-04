// AI Auction Strategist Agent — Groq LLM integration
// This module handles the core AI reasoning for auction strategy

import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "./prompt.js";
import { tools, executeToolCall } from "./tools.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Run the AI Auction Strategist agent.
 * Accepts seller goal + NFT bundle metadata, returns reasoning + auction params.
 */
export async function runStrategist({ sellerGoal, nftBundle, collectionInfo }) {
  const userMessage = buildUserMessage({ sellerGoal, nftBundle, collectionInfo });

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    tools,
    tool_choice: "auto",
    temperature: 0.7,
    max_tokens: 2048,
  });

  return response;
}

function buildUserMessage({ sellerGoal, nftBundle, collectionInfo }) {
  return `
## Seller Goal
${sellerGoal}

## NFT Bundle (${nftBundle.length} NFTs)
${JSON.stringify(nftBundle, null, 2)}

## Collection Info
${JSON.stringify(collectionInfo, null, 2)}

## Market Context (estimated)
- Recent average sale price: ~0.5 MON
- Collection demand: moderate
- Current active auctions: 3
- Average bid count per auction: 4

Analyze this bundle and create the optimal auction strategy.
  `.trim();
}
