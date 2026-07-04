import { getAuctionStrategy, NFTMetadata, MarketContext } from "../ai/strategist.js";
import { executeAuctionTool, ToolExecutionResult } from "../ai/tools.js";
import { emitReasoningStep } from "./socket.js";
import { MarketContextService } from "./market.js";
import { blitzTimerService } from "./timer.js";

const marketService = new MarketContextService();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface CreateAuctionDTO {
  vaultId: number;
  sellerGoal: string;
  nftBundle: NFTMetadata[];
  marketContext?: MarketContext;
  socketId?: string; // Optional socket ID to send live stream updates to
}

/**
 * Service handling seller-side business logic for auction strategizing and creation.
 */
export class SellerService {
  /**
   * Strategizes and deploys an auction for a seller's NFT vault.
   * Streams reasoning updates to the client if a socketId is provided.
   */
  public async strategizeAndDeploy(dto: CreateAuctionDTO): Promise<ToolExecutionResult> {
    const { vaultId, sellerGoal, nftBundle, socketId } = dto;

    // Helper to send progress socket messages
    const emit = (message: string, progress: number) => {
      if (socketId) {
        emitReasoningStep(socketId, message, progress);
      }
    };

    // Phase 1: Pre-AI Analysis (Emulated Timed Starts)
    emit("Analyzing NFT bundle...", 10);
    await sleep(600);

    emit("Checking rarity distribution and floor values...", 25);
    await sleep(600);

    emit("Querying Monad testnet market activity...", 40);

    // Prepare Market Context
    const collectionName = nftBundle[0]?.collectionName || "Mystery Collection";
    const marketContext = dto.marketContext || marketService.getMarketContext(collectionName, nftBundle.length);

    // Phase 2: Core AI Reasoning (Real LLM invocation)
    const strategy = await getAuctionStrategy(sellerGoal, nftBundle, marketContext);

    emit("Reading seller objective: '" + sellerGoal + "'...", 55);
    await sleep(600);

    // Phase 3: AI Generated Step Output Streams
    const steps = strategy.reasoningSteps;
    for (let i = 0; i < steps.length; i++) {
      // Map reasoning steps between 60% and 85% progress
      const progress = 60 + Math.floor((i / steps.length) * 25);
      emit(steps[i] + "...", progress);
      await sleep(700);
    }

    emit(`Selecting optimal reserve price: ${strategy.reservePrice} MON...`, 90);
    await sleep(600);

    // Phase 4: Blockchain tool execution
    emit("Preparing transaction signer...", 93);
    await sleep(400);

    emit("Executing createAuction() tool call on Monad Testnet. Awaiting block confirmation...", 96);
    
    const result = await executeAuctionTool(vaultId, strategy);

    // Launch the 60-second blitz timer countdown session
    blitzTimerService.startBlitzTimer(vaultId);

    emit(`Success! Auction ${vaultId} deployed. TX: ${result.transactionHash.substring(0, 10)}...`, 100);

    return result;
  }
}
