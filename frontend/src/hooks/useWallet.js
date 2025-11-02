import { useState, useEffect, useCallback } from 'react'
import { blockchainService } from '../utils/blockchain'

export const useWallet = () => {
  const [account, setAccount] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const connectWallet = useCallback(async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      rr)n,'lgalse)
    setError(null)
  }, [])

  const switchToAvalanche = useCallback(async () => {
    // This logic is now handled inside blockchainService.connectWallet()
    // but we can expose i .switchToAvalanche()
  }, [])

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && blockchainService.isConnected()) {
        try {
          const currentAccount = await blockchainService.getAccount()
          setAccount(currentAccount)
          setIsConnected(!!currentAccount)
        } catch (err) {
          console.error('Error checking wallet connection:', err)
        }
      } anges
 useffeclet,
    disconnectWallet,
    switchToAvalanche
  }
}