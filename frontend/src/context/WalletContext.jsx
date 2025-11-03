/**
 * Wallet Context
 * Manages wallet connection state using wagmi and ethers.
 * This provides a simple interface for connecting/disconnecting a wallet and
 * accessing the user's account information throughout the application.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const WalletContext = createContext();

/**
 * Custom hook to access the wallet context.
 * @returns {Object} The wallet context value.
 */
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const { address, isConnected: isWagmiConnected } = useAccount();
  const { connect, error: connectError, isLoading: isConnecting } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isWagmiConnected && address) {
      setAccount(address);
      setIsConnected(true);
    } else {
      setAccount(null);
      setIsConnected(false);
    }
  }, [address, isWagmiConnected]);

  useEffect(() => {
    if (connectError) {
      setError(connectError.message);
    }
  }, [connectError]);

  const connectWallet = () => {
    setError(null);
    connect();
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const value = {
    account,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};