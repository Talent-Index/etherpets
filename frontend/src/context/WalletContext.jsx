/**
 * Wallet Context for managing blockchain wallet connections
 * Handles MetaMask integration, account management, and network switching
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { avalancheFuji } from 'wagmi/chains'

// Create context for wallet data
const WalletContext = createContext()

/**
 * Custom hook to access wallet context
 * @returns {Object} Wallet context value
 */
export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [error, setError] = useState(null)

  // Wagmi hooks for wallet state and actions
  const { address, isConnected, isConnecting, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  /**
   * Connect to the user's wallet (MetaMask)
   */
  const connectWallet = useCallback(async () => {
    setError(null)
    try {
      // Find the injected connector (e.g., MetaMask)
      const injectedConnector = connectors.find(c => c.id === 'injected')
      connect({ connector: injectedConnector || connectors[0] })
    } catch (err) {
      console.error('Error connecting wallet:', err)
      setError(err.message)
    }
  }, [connect, connectors])

  /**
   * Disconnect the wallet
   */
  const disconnectWallet = useCallback(() => {
    setError(null)
    disconnect()
  }, [disconnect])

  /**
   * Switch to Avalanche Fuji Testnet
   */
  const switchToAvalanche = useCallback(async () => {
    if (switchChain) {
      switchChain({ chainId: avalancheFuji.id })
    }
  }, [switchChain])

  // Context value containing all wallet-related state and functions
  const value = {
    account: address,
    isConnected,
    isConnecting,
    error,
    network: chain,
    connectWallet,
    disconnectWallet,
    switchToAvalanche
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}