// Tool definitions for Groq function calling
// The AI agent uses these tools to interact with the blockchain

import { createAuctionOnChain } from "../blockchain/auction.js";

/**
 * Tool definitions in OpenAI-compatible format for Groq
 */
export const tools = [
  {
    type: "function",
    function: {
      name: "createAuction",
      description:
        "Create a new blind NFT bundle auction on the Monad blockchain. This deploys the auction to the smart contract with the specified parameters.",
      parameters: {
        type: "object",
        properties: {
          reservePrice: {
            type: "string",
            description:
              "The minimum bid price in MON (as a decimal string, e.g. '0.05'). Bids below this are rejected.",
          },
          duration: {
            type: "number",
            description:
              "Auction duration in seconds. Recommended range: 60-600 for Blitz mode.",
          },
          nftTokenIds: {
            type: "array",
            items: { type: "number" },
            description: "Array of NFT token IDs to include in the bundle.",
          },
          reasoning: {
            type: "string",
            description:
              "Brief explanation of why these parameters were chosen.",
          },
        },
        required: ["reservePrice", "duration", "nftTokenIds", "reasoning"],
      },
    },
  },
];

/**
 * Execute a tool call returned by the LLM
 */
export async function executeToolCall(toolCall) {
  const { name, arguments: argsStr } = toolCall.function;
  const args = JSON.parse(argsStr);

  switch (name) {
    case "createAuction":
      return await createAuctionOnChain(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
