/**
 * Wallet Context for managing blockchain wallet connections
 * Handles MetaMask integration, account management, and network switching
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

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
  const [account, setAccount] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [network, setNetwork] = useState(null)

  /**
   * Connect to the user's wallet (MetaMask)
   * @returns {Promise<string>} The connected account address
   */
  const connectWallet = useCallback(async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask to connect your wallet.')
      }

      // Request account access from user
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        const account = accounts[0]
        setAccount(account)
        setIsConnected(true)
        
        // Get current network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        setNetwork(chainId)
        
        return account
      } else {
        throw new Error('No accounts found. Please make sure your wallet has accounts.')
      }
    } catch (err) {
      console.error('Error connecting wallet:', err)
      setError(err.message)
      throw err
    } finally {
      setIsConnecting(false)
    }
  }, [])

  /**
   * Disconnect the wallet
   */
  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setIsConnected(false)
    setError(null)
    setNetwork(null)
  }, [])

  /**
   * Switch to Avalanche Fuji Testnet
   */
  const switchToAvalanche = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xA869' }], // Avalanche Fuji Testnet
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xA869',
                chainName: 'Avalanche Fuji Testnet',
                rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                blockExplorerUrls: ['https://testnet.snowtrace.io/'],
                nativeCurrency: {
                  name: 'AVAX',
                  symbol: 'AVAX',
                  decimals: 18
                }
              }
            ]
          })
        } catch (addError) {
          throw new Error('Failed to add Avalanche network to MetaMask')
        }
      } else {
        throw switchError
      }
    }
  }, [])

  /**
   * Check connection status on component mount
   */
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          })
          
          if (accounts.length > 0) {
            setAccount(accounts[0])
            setIsConnected(true)
            
            // Get current network
            const chainId = await window.ethereum.request({ method: 'eth_chainId' })
            setNetwork(chainId)
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err)
        }
      }
    }

    checkConnection()
  }, [])

  /**
   * Listen for account and network changes
   */
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAccount(accounts[0])
          setIsConnected(true)
        }
      }

      const handleChainChanged = (chainId) => {
        setNetwork(chainId)
        // Reload the page when chain changes to ensure proper network state
        window.location.reload()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [disconnectWallet])

  // Context value containing all wallet-related state and functions
  const value = {
    account,
    isConnected,
    isConnecting,
    error,
    network,
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