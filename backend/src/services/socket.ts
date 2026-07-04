import { Server as SocketServer } from "socket.io";

let ioInstance: SocketServer | null = null;

/**
 * Initializes the Socket service with the Express/Socket.io server instance
 * to avoid circular dependency loops.
 */
export function initSocketService(io: SocketServer): void {
  ioInstance = io;
  console.log("[SocketService] Initialized successfully");
}

/**
 * Broadcast event when a new vault is created (pre-auction)
 */
export function broadcastAuctionCreated(vaultId: number, reservePrice: string): void {
  if (!ioInstance) return;
  ioInstance.emit("auction-created", { vaultId, reservePrice });
  console.log(`[SocketService] Broadcasted auction-created for vault ${vaultId}`);
}

/**
 * Broadcast event when an auction is started / activated
 */
export function broadcastAuctionStarted(vaultId: number, startTime: number, endTime: number): void {
  if (!ioInstance) return;
  ioInstance.emit("auction-started", { vaultId, startTime, endTime });
  console.log(`[SocketService] Broadcasted auction-started for vault ${vaultId}`);
}

/**
 * Broadcast event when an auction is live/active
 */
export function broadcastAuctionLive(vaultId: number): void {
  if (!ioInstance) return;
  ioInstance.emit("auction-live", { vaultId });
}

/**
 * Broadcast event when a bid is placed
 */
export interface BidBroadcast {
  vaultId: number;
  nickname: string;
  amount: string;
  timeRemaining: number;
}

export function broadcastBidPlaced(data: BidBroadcast): void {
  if (!ioInstance) return;
  
  // Emit detailed bid placed event
  ioInstance.emit("bid-placed", data);

  // Emit summary highest-bid-updated event
  ioInstance.emit("highest-bid-updated", {
    vaultId: data.vaultId,
    highestBid: data.amount,
    highestBidderNickname: data.nickname,
    timeRemaining: data.timeRemaining,
  });

  console.log(`[SocketService] Broadcasted bid-placed and highest-bid-updated for vault ${data.vaultId} by ${data.nickname}`);
}

/**
 * Broadcast event when an auction conclusion is triggered
 */
export function broadcastAuctionEnded(vaultId: number, winnerNickname: string, finalPrice: string): void {
  if (!ioInstance) return;
  ioInstance.emit("auction-ended", { vaultId, winnerNickname, finalPrice });
  console.log(`[SocketService] Broadcasted auction-ended for vault ${vaultId}`);
}

/**
 * Broadcast event when the winner reveals the NFTs in the concluded auction
 */
export function broadcastWinnerRevealed(vaultId: number, winnerNickname: string, nfts: any[]): void {
  if (!ioInstance) return;
  ioInstance.emit("winner-revealed", { vaultId, winnerNickname, nfts });
  console.log(`[SocketService] Broadcasted winner-revealed for vault ${vaultId}`);
}

/**
 * Emit reasoning step updates directly to the specific seller's frontend client
 */
export function emitReasoningStep(socketId: string, message: string, progress: number): void {
  if (!ioInstance) return;
  ioInstance.to(socketId).emit("reasoning-progress", { message, progress });
  console.log(`[SocketService] Sent reasoning step to ${socketId}: "${message}" (${progress}%)`);
}

