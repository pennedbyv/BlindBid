import { createAuction } from "../blockchain/client.js";
import { StrategistResult } from "./strategist.js";

export interface ToolExecutionResult {
  success: boolean;
  transactionHash: string;
  vaultId: number;
  blockNumber: number;
  reservePrice: string;
  duration: number;
  strategy: string;
  reasoningSteps: string[];
}

/**
 * Validates the raw JSON output from the AI Auction Strategist.
 */
export function validateAIOutput(aiOutput: any): StrategistResult {
  if (!aiOutput) {
    throw new Error("AI output is empty or undefined");
  }

  const requiredFields = [
    "reservePrice",
    "duration",
    "strategy",
    "reasoningSteps",
    "estimatedValue",
    "confidenceScore",
    "raritySummary"
  ];

  for (const field of requiredFields) {
    if (aiOutput[field] === undefined || aiOutput[field] === null) {
      throw new Error(`Missing required field in AI strategist output: ${field}`);
    }
  }

  if (typeof aiOutput.reservePrice !== "string" || isNaN(Number(aiOutput.reservePrice))) {
    throw new Error("reservePrice must be a valid numeric decimal string");
  }

  if (typeof aiOutput.duration !== "number" || aiOutput.duration <= 0) {
    throw new Error("duration must be a positive integer representing seconds");
  }

  if (!Array.isArray(aiOutput.reasoningSteps) || aiOutput.reasoningSteps.length === 0) {
    throw new Error("reasoningSteps must be a non-empty array of strings");
  }

  if (typeof aiOutput.estimatedValue !== "string" || isNaN(Number(aiOutput.estimatedValue))) {
    throw new Error("estimatedValue must be a valid numeric decimal string");
  }

  if (typeof aiOutput.confidenceScore !== "number" || aiOutput.confidenceScore < 0 || aiOutput.confidenceScore > 100) {
    throw new Error("confidenceScore must be a number between 0 and 100");
  }

  if (typeof aiOutput.raritySummary !== "string" || aiOutput.raritySummary.trim() === "") {
    throw new Error("raritySummary must be a non-empty string");
  }

  return aiOutput as StrategistResult;
}

/**
 * Tool Executor / Bridge
 * Takes the validated AI output and executes the corresponding smart contract call on-chain.
 */
export async function executeAuctionTool(
  vaultId: number,
  aiOutput: any
): Promise<ToolExecutionResult> {
  console.log(`[ToolExecutor] Starting execution for vault ${vaultId}...`);

  // Step 1: Validate strategist result
  const validatedData = validateAIOutput(aiOutput);

  // Step 2: Bridge parameters and call smart contract
  const receipt = await createAuction(
    vaultId,
    validatedData.reservePrice,
    validatedData.duration,
    validatedData.estimatedValue,
    validatedData.confidenceScore,
    validatedData.raritySummary
  );

  console.log(`[ToolExecutor] Execution completed successfully for vault ${vaultId}`);

  return {
    success: true,
    transactionHash: receipt.hash,
    vaultId,
    blockNumber: receipt.blockNumber,
    reservePrice: validatedData.reservePrice,
    duration: validatedData.duration,
    strategy: validatedData.strategy,
    reasoningSteps: validatedData.reasoningSteps,
  };
}
