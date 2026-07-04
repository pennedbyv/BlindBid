import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { config } from "./config/env.js";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new SocketServer(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
  },
});

import { initSocketService } from "./services/socket.js";
initSocketService(io);

import sellerRouter from "./routes/seller.js";
import auctionRouter from "./routes/auction.js";
import biddingRouter from "./routes/bidding.js";

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Register API Routes
app.use("/seller", sellerRouter);
app.use("/", auctionRouter);
app.use("/", biddingRouter);

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "blindbid-backend", timestamp: new Date().toISOString() });
});

// Start the server
httpServer.listen(config.port, () => {
  console.log(`[Server] BlindBid backend listening on http://localhost:${config.port}`);
  console.log(`[Server] Websocket handler initialized`);
});

// Export io instance for use in services/controllers
export { io };
