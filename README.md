# 🕵️‍♂️ BlindBid — AI-Powered Blind NFT Bundle Auctions on Monad

**BlindBid** is an AI-powered, zero-emotional-bias blind NFT bundle auction platform built for the **Monad Blitz AI Agent Hackathon**. 

Instead of forcing sellers to manually configure complex pricing parameters, sellers simply select their NFT bundle, write a natural language selling goal, and let our off-chain **AI Auction Strategist Agent** (powered by Groq Llama 3.3) dynamically plan, price, and deploy the optimal auction parameters directly to the Monad Testnet.

Buyers compete in a sealed-bid "blind bundle" format where the exact assets are kept hidden until settlement, prompting players to bid based on objective metrics (estimated value, rarity statistics, and AI confidence levels) rather than brand recognition or emotional attachment.

---

## 🚀 Live Smart Contract Address

*   **BlindBidAuction (Monad Testnet):** `0xcffBE97DB6ccA8CD13C5Bbe72aD0A5F0Ade6FdaF`

---

## 🛠️ Core Architecture

```
 Seller (Human)
      │
      ├─► Connect Wallet & Select NFTs
      ├─► Enter Selling Goal (e.g. "Sell as fast as possible")
      │
      ▼
 AI Auction Strategist Agent (Groq LLM)
      │
      ├─► Analyzes NFT Rarities & Market Context (Floor, Volatility)
      ├─► Streams Reasoning live via Socket.io
      ├─► Formulates Reserve Price & Duration parameters
      │
      ▼
 Tool Executor (Backend Relayer)
      │
      ├─► Executes contract transaction on Monad Testnet
      │
      ▼
 On-Chain Auction Activation
      │
      ├─► Launches 60-Second Blitz countdown
      ├─► Buyers submit sealed bids using alias nicknames
      ├─► Settlement transfers bundle to winner & funds to seller
```

---

## ✨ Features Built

*   **AI Auction Strategist Agent:** Interprets seller objectives and maps them to tailored parameters (reserve prices, durations, and strategies) using Groq.
*   **AI Reasoning Stream:** Streams the strategist's internal reasoning steps live to the seller's dashboard via Socket.io before final deployment.
*   **On-Chain Bundle Escrow:** Deploys bundles on-chain in escrow vaults. Winners receive the complete vault upon settlement; if no bids arrive, NFTs automatically revert to the seller.
*   **60s Blitz Mode:** Countdown timer starts on auction creation. If no bid is registered within 60 seconds, the backend automatically concludes and returns assets. The first bid cancels the timer and extends the auction.
*   **Blind Auction Privacy:** Getters like `getAuctionCard` hide specific NFT addresses and IDs from buyers. Detailed metadata is unlocked only when the auction conclusion triggers.
*   **Deterministic Nickname Sessions:** Generates deterministic hacker pseudonyms from bidder addresses (e.g. `Blitz Ape`, `Hyper Nomad`) to make the interface highly interactive without relying on a database.

---

## 📂 Project Structure

```
├── frontend/              # React + Vite + Tailwind CSS dashboard
├── backend/               # Express + TypeScript API server
│   ├── src/ai/            # LLM Prompts, Tools and Executors
│   ├── src/blockchain/    # Ethers.js v6 Monad RPC configuration
│   ├── src/services/      # Bidding, Market mock, and Socket.io handlers
│   └── src/index.ts       # Server boot configuration
└── contracts/             # Hardhat smart contracts (Solidity v0.8.28)
```

---

## ⚡ Running Locally

### 1. Prerequisites
*   Node.js (v18+)
*   npm

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```ini
# Central Env Config
FRONTEND_PORT=5173
BACKEND_PORT=4000
CORS_ORIGIN=http://localhost:5173

GROQ_API_KEY=your_groq_api_key_here
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
PRIVATE_KEY=your_deployer_or_relayer_private_key_here
CHAIN_ID=10143

AUCTION_CONTRACT_ADDRESS=0x0e1cc6D36A31620DB96C90946fB8880472E42c53
NFT_CONTRACT_ADDRESS=0xE66515be2b2683a99Ba8fB88060f5957D6F39DD2
```

### 3. Run the Monorepo
Install root dependencies and start both the frontend and backend simultaneously:

```bash
# Install dependencies for all workspaces
npm install

# Start development servers
npm run dev
```

*   **Frontend dashboard:** `http://localhost:5173`
*   **Backend server:** `http://localhost:4000`