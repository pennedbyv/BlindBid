import { defineChain } from 'viem';
import { http, createConfig } from 'wagmi';
import { injected, coinbaseWallet } from 'wagmi/connectors';

// Define Monad Testnet Chain
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MonadExplorer', url: 'https://testnet.monadexplorer.com' },
  },
});

// Configure Wagmi with Injected (MetaMask, Rabby) and Coinbase Wallet
export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected({ target: 'metaMask', name: 'MetaMask' }),
    injected({ name: 'Injected Wallet' }),
    coinbaseWallet({ appName: 'BlindBid' }),
  ],
  transports: {
    [monadTestnet.id]: http(),
  },
});
