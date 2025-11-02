/**
 * Blockchain Service for Ethereum/Avalanche interactions
 * Handles wallet connections, contract interactions, and network management
 */
import { ethers } from 'ethers'

// Avalanche Fuji Testnet configuration
const AVALANCHE_TESTNET = {
  chainId: '0xA869', // 43113 in decimal
  chainName: 'Avalanche Fuji Testnet',
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/'],
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18
  }
}

// Mainnet configuration (for future use)
const AVALANCHE_MAINNET = {
  chainId: '0xA86A', // 43114 in decimal
  chainName: 'Avalanche Mainnet',
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowtrace.io/'],
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18
  }
}

/**
 * Blockchain Service Class
 * Provides methods for wallet interaction and smart contract calls
 */
export class BlockchainService {
  constructor() {
    this.provider = null
    this.signer = null
    this.contracts = {}
    this.network = null
  }

  /**
   * Connect to user's wallet (MetaMask)
   * @returns {Promise<string>} Connected account address
   * @throws {Error} If MetaMask is not installed or connection fails
   */
  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed. Please install MetaMask to connect your wallet.')
    }

    try {
      // Request account access from user
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure your wallet has accounts.')
      }

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      
      // Check and switch to Avalanche network if needed
      await this.switchToAvalanche()
      
      // Get and return the connected account
      const account = await this.signer.getAddress()
      return account

    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }

  /**
   * Switch to Avalanche Fuji Testnet
   * @throws {Error} If network switch fails
   */
  async switchToAvalanche() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_TESTNET.chainId }],
      })
      this.network = 'avalanche-testnet'
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_TESTNET],
          })
          this.network = 'avalanche-testnet'
        } catch (addError) {
          throw new Error('Failed to add Avalanche network to MetaMask')
        }
      } else {
        throw switchError
      }
    }
  }

  /**
   * Get current connected account
   * @returns {Promise<string|null>} Current account address or null
   */
  async getAccount() {
    if (!this.signer) return null
    try {
      return await this.signer.getAddress()
    } catch (error) {
      console.error('Error getting account:', error)
      return null
    }
  }

  /**
   * Get account balance in AVAX
   * @returns {Promise<string>} Formatted balance string
   */
  async getBalance() {
    if (!this.signer) return '0'
    try {
      const address = await this.signer.getAddress()
      const balance = await this.provider.getBalance(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Error getting balance:', error)
      return '0'
    }
  }

  /**
   * Get current network information
   * @returns {Promise<Object>} Network data
   */
  async getNetwork() {
    if (!this.provider) return null
    try {
      const network = await this.provider.getNetwork()
      return {
        name: network.name,
        chainId: network.chainId.toString(),
        ensAddress: network.ensAddress
      }
    } catch (error) {
      console.error('Error getting network:', error)
      return null
    }
  }

  /**
   * Simulate minting a pet NFT (for demo purposes)
   * @param {Object} petData - Pet data to mint
   * @note In production, this would interact with the EtherPets smart contract.
   * @returns {Promise<Object>} Transaction result
   */
  async mintPet(petData) {
    // Simulate blockchain transaction delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Simulate successful minting
          const result = {
            hash: '0x' + Math.random().toString(16).substr(2, 64),
            status: 'success',
            tokenId: Math.floor(Math.random() * 10000).toString(),
            petData: petData,
            timestamp: new Date().toISOString()
          }
          resolve(result)
        } catch (error) {
          reject(new Error('Failed to mint pet NFT'))
        }
      }, 2000) // 2 second delay to simulate blockchain transaction
    })
  }

  /**
   * Simulate updating pet mood on-chain
   * @param {string} petId - Pet NFT token ID
   * @note In production, this would be a call to a specific function on the smart contract.
   * @param {string} mood - New mood value
   * @returns {Promise<Object>} Transaction result
   */
  async updatePetMood(petId, mood) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = {
            hash: '0x' + Math.random().toString(16).substr(2, 64),
            status: 'success',
            petId: petId,
            mood: mood,
            timestamp: new Date().toISOString()
          }
          resolve(result)
        } catch (error) {
          reject(new Error('Failed to update pet mood'))
        }
      }, 1000) // 1 second delay
    })
  }

  /**
   * Simulate transferring tokens between accounts
   * @param {string} to - Recipient address
   * @param {string} amount - Amount to transfer
   * @param {string} token - Token symbol (HMY for Harmony)
   * @note In production, this would interact with an ERC20 token contract.
   * @returns {Promise<Object>} Transaction result
   */
  async transferTokens(to, amount, token = 'HMY') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = {
            hash: '0x' + Math.random().toString(16).substr(2, 64),
            status: 'success',
            from: this.signer ? this.signer.address : '0x...',
            to: to,
            amount: amount,
            token: token,
            timestamp: new Date().toISOString()
          }
          resolve(result)
        } catch (error) {
          reject(new Error('Failed to transfer tokens'))
        }
      }, 1500)
    })
  }

  /**
   * Check if wallet is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.signer !== null
  }

  /**
   * Disconnect wallet
   */
  disconnect() {
    this.provider = null
    this.signer = null
    this.contracts = {}
    this.network = null
  }

  /**
   * Listen for account changes
   * @param {Function} callback - Callback function when accounts change
   */
  onAccountsChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback)
    }
  }

  /**
   * Listen for network changes
   * @param {Function} callback - Callback function when network changes
   */
  onChainChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback)
    }
  }

  /**
   * Remove event listeners
   */
  removeListeners() {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged')
      window.ethereum.removeAllListeners('chainChanged')
    }
  }
}

// Create and export a singleton instance
export const blockchainService = new BlockchainService()