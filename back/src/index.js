import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import aiRoutes from "./routes/ai.js";

dotenv.config({ path: "../.env" });

const app = express();
const port = Number(process.env.BACKEND_PORT || 4000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json());

// ── Health ────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "blindbid-backend" });
});

// ── AI Strategist Routes ─────────────────────
app.use("/api/ai", aiRoutes);

// ── Start ─────────────────────────────────────
app.listen(port, () => {
  console.log(`BlindBid backend listening on http://localhost:${port}`);
  console.log(`  AI Strategist:  POST /api/ai/strategize`);
  console.log(`  Health:         GET  /health`);
});
