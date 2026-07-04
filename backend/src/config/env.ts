import dotenv from "dotenv";
import path from "path";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

export interface Config {
  port: number;
  corsOrigin: string;
  groqApiKey: string;
  monadRpcUrl: string;
  privateKey: string;
  auctionContractAddress: string;
  nftContractAddress: string;
  chainId: number;
}

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnvOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const config: Config = {
  port: Number(getEnvOrDefault("BACKEND_PORT", "4000")),
  corsOrigin: getEnvOrDefault("CORS_ORIGIN", "http://localhost:5173"),
  groqApiKey: getEnvOrDefault("GROQ_API_KEY", ""), // Empty defaults to avoid throwing if not yet configured
  monadRpcUrl: getEnvOrDefault("MONAD_RPC_URL", "https://testnet-rpc.monad.xyz"),
  privateKey: getEnvOrDefault("PRIVATE_KEY", ""),
  auctionContractAddress: getEnvOrDefault("AUCTION_CONTRACT_ADDRESS", ""),
  nftContractAddress: getEnvOrDefault("NFT_CONTRACT_ADDRESS", ""),
  chainId: Number(getEnvOrDefault("CHAIN_ID", "10143")),
};
