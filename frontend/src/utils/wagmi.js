/**
 * Wagmi Configuration Utilities
 * Helper functions for Web3 wallet connections and blockchain interactions
 */
import { createConfig, http } from 'wagmi';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

/**
 * Wagmi configuration for Avalanche network
 */
export const config = createConfig({
  chains: [avalanche, avalancheFuji],
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
    }),
  ],
  transports: {
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(),
  },
});

/**
 * Helper to get the current chain ID
 */
export const getCurrentChainId = () => {
  return config.state.chainId;
};

/**
 * Helper to check if connected to testnet
 */
export const isTestnet = () => {
  return config.state.chainId === avalancheFuji.id;
};

/**
 * Helper to get chain name
 */
export const getChainName = (chainId) => {
  switch (chainId) {
    case avalanche.id:
      return 'Avalanche';
    case avalancheFuji.id:
      return 'Avalanche Fuji Testnet';
    default:
      return 'Unknown Network';
  }
};

/**
 * Format wallet address for display
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default config;
