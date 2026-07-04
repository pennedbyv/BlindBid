import Groq from "groq-sdk";
import { config } from "../config/env.js";
import { SYSTEM_PROMPT } from "./prompt.js";

// Initialize Groq client
const groq = new Groq({
  apiKey: config.groqApiKey || "mock-api-key", // Fallback to avoid startup crash if key isn't provided yet
});

export interface NFTMetadata {
  tokenId: number;
  collectionName: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  imageUrl: string;
  name: string;
}

export interface MarketContext {
  floorPrice: string;
  volume24h: string;
  recentSalesAvg: string;
}

export interface StrategistResult {
  reservePrice: string;
  duration: number;
  strategy: string;
  reasoningSteps: string[];
  estimatedValue: string;
  confidenceScore: number;
  raritySummary: string;
}

/**
 * Parses and cleans the Groq response string into a structured object
 */
function parseResponse(text: string): StrategistResult {
  // Strip potential markdown code block backticks
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "");
  }
  
  const parsed = JSON.parse(cleaned);

  // Validate types
  if (
    typeof parsed.reservePrice !== "string" ||
    typeof parsed.duration !== "number" ||
    typeof parsed.strategy !== "string" ||
    !Array.isArray(parsed.reasoningSteps) ||
    typeof parsed.estimatedValue !== "string" ||
    typeof parsed.confidenceScore !== "number" ||
    typeof parsed.raritySummary !== "string"
  ) {
    throw new Error("Invalid output structure returned by model");
  }

  return parsed as StrategistResult;
}

/**
 * Runs the AI strategist against Groq Llama model with automatic retry fallback on invalid JSON.
 */
export async function getAuctionStrategy(
  sellerGoal: string,
  nftBundle: NFTMetadata[],
  marketContext: MarketContext
): Promise<StrategistResult> {
  // If API key is missing, return a mocked strategy instead of failing hard (useful for hackathon debug/demo)
  if (!config.groqApiKey) {
    console.warn("[AI] GROQ_API_KEY is not defined, returning mock strategist result.");
    return getMockStrategy(sellerGoal, nftBundle);
  }

  const promptContent = `
## Input Data
1. Seller Goal: "${sellerGoal}"
2. NFT Bundle: ${JSON.stringify(nftBundle, null, 2)}
3. Market Context: ${JSON.stringify(marketContext, null, 2)}

Provide your response in JSON format.
  `.trim();

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      console.log(`[AI] Querying Groq (attempt ${attempts}/${maxAttempts})...`);

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: promptContent },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from Groq");
      }

      const parsed = parseResponse(content);
      console.log(`[AI] Strategy generated successfully! Strategy: ${parsed.strategy}`);
      return parsed;

    } catch (error: any) {
      console.error(`[AI] Attempt ${attempts} failed:`, error.message || error);
      if (attempts >= maxAttempts) {
        console.warn("[AI] Max attempts reached, using fallback mock strategist result.");
        return getMockStrategy(sellerGoal, nftBundle);
      }
    }
  }

  return getMockStrategy(sellerGoal, nftBundle);
}

/**
 * Fallback / Mock generator in case Groq is unavailable or API key is not supplied.
 * Ensures the platform works end-to-end at all times.
 */
function getMockStrategy(sellerGoal: string, nftBundle: NFTMetadata[]): StrategistResult {
  const goalLower = sellerGoal.toLowerCase();
  
  // Rarity calculation for summary
  const rarities = nftBundle.map(n => n.rarity);
  const counts = rarities.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const raritySummary = Object.entries(counts)
    .map(([r, count]) => `${count} ${r}`)
    .join(", ");

  const bundleValue = nftBundle.length * 0.5; // assume 0.5 MON average floor

  if (goalLower.includes("fast") || goalLower.includes("quick")) {
    return {
      reservePrice: (bundleValue * 0.7).toFixed(2), // 30% discount
      duration: 120, // 2 minutes blitz
      strategy: "Speed Blitz pricing strategy to attract immediate action and fast bidding turnovers.",
      reasoningSteps: [
        "Analyzing NFT bundle components",
        "Calculating estimated floor value to be " + bundleValue + " MON",
        "Detecting urgent sale requirement from seller goal",
        "Applying 30% markdown for discount reserve price of " + (bundleValue * 0.7).toFixed(2) + " MON",
        "Setting short 2-minute rolling timer to create FOMO"
      ],
      estimatedValue: bundleValue.toFixed(2),
      confidenceScore: 90,
      raritySummary,
    };
  }

  if (goalLower.includes("profit") || goalLower.includes("max") || goalLower.includes("premium")) {
    return {
      reservePrice: (bundleValue * 1.2).toFixed(2), // 20% premium
      duration: 600, // 10 minutes
      strategy: "High-yield premium strategist model maximizing bundle values for patient bids.",
      reasoningSteps: [
        "Analyzing NFT bundle components and rarity distribution",
        "Valuating rarity premium additions",
        "Detecting profit maximization goal",
        "Setting reserve price at 20% premium: " + (bundleValue * 1.2).toFixed(2) + " MON",
        "Setting longer 10-minute duration to let high bidders match expectations"
      ],
      estimatedValue: (bundleValue * 1.1).toFixed(2),
      confidenceScore: 80,
      raritySummary,
    };
  }

  // Default balanced strategy
  return {
    reservePrice: bundleValue.toFixed(2),
    duration: 300, // 5 minutes
    strategy: "Balanced valuation and timing to match standard market behavior.",
    reasoningSteps: [
      "Analyzing NFT bundle components",
      "Setting reserve price to benchmark value: " + bundleValue.toFixed(2) + " MON",
      "Targeting general market interest",
      "Selecting standard 5-minute duration window"
    ],
    estimatedValue: bundleValue.toFixed(2),
    confidenceScore: 85,
    raritySummary,
  };
}
