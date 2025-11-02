import { ethers } from 'ethers'
import apiClient from './api'

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
 * Provides a comprehensive service for interacting with the blockchain.
 * This class abstracts away the complexities of wallet connections, network switching,
 * and smart contract interactions using ethers.js.
 */
export class BlockchainService {
  /**
   * Initializes the BlockchainService with null provider, signer, and other properties.
   */
  constructor() {
    this.provider = null
    this.signer = null
    this.contracts = {}
    this.network = null
  }

  /**
   * Connects to the user's Ethereum wallet (e.g., MetaMask).
   * It requests account access, sets up the provider and signer, and ensures the correct network is selected.
   * @returns {Promise<string>} The connected wallet address.
   * @throws {Error} If MetaMask is not installed, the user denies connection, or no accounts are found.
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
   * Switches the user's wallet to the Avalanche Fuji Testnet.
   * If the network is not already added to the wallet, it prompts the user to add it.
   * @throws {Error} If the network switch or addition fails.
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
   * Retrieves the address of the currently connected account.
   * @returns {Promise<string|null>} The current account address, or null if not connected.
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
   * Fetches the AVAX balance of the connected account.
   * @returns {Promise<string>} The balance formatted as a string in AVAX, or '0' if an error occurs.
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
   * Retrieves information about the currently connected network.
   * @returns {Promise<ethers.Network | null>} An object containing network details (name, chainId), or null if not connected.
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
   * Simulates minting a new pet NFT.
   * In a production environment, this would interact with a real smart contract.
   * @param {object} petData - The metadata for the pet to be minted.
   * @returns {Promise<object>} A simulated transaction result object containing a hash, status, and tokenId.
   */
  async mintPet(petData) {
    if (!this.signer) throw new Error('Wallet not connected');
    try {
      const ownerAddress = await this.getAccount();
      // The backend's /api/pets endpoint handles minting
      const response = await apiClient.post('/pets', {
        ...petData,
        owner: ownerAddress,
      });
      return response.data; // Assuming backend returns transaction details
    } catch (error) {
      console.error('Error minting pet:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  /**
   * Updates a pet's mood by calling the backend, which then interacts with the smart contract.
   * @param {string} petId - The token ID of the pet NFT to update.
   * @param {string} mood - The new mood value to set for the pet.
   * @returns {Promise<object>} The transaction result from the backend.
   */
  async updatePetMood(petId, mood) {
    if (!this.signer) throw new Error('Wallet not connected');
    try {
      // Assuming a backend endpoint like /api/pets/:petId/mood
      const response = await apiClient.post(`/pets/${petId}/mood`, { mood });
      return response.data;
    } catch (error) {
      console.error('Error updating pet mood:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  /**
   * Transfers a specified amount of tokens by calling the backend.
   * @param {string} to - The recipient's wallet address.
   * @param {string} amount - The amount of tokens to transfer.
   * @param {string} [token='HMY'] - The symbol of the token being transferred.
   * @returns {Promise<object>} The transaction result from the backend.
   */
  async transferTokens(to, amount, token = 'HMY') {
    if (!this.signer) throw new Error('Wallet not connected');
    // This endpoint doesn't exist in your backend README, but would be the correct pattern.
    // Example: const response = await apiClient.post('/tokens/transfer', { to, amount, token });
    // For now, we'll keep it as a placeholder.
    console.warn("transferTokens function needs a corresponding backend endpoint.");
    return { hash: '0x...', status: 'pending' };
  }

  /**
   * Checks if a wallet is currently connected.
   * @returns {boolean} `true` if a signer is available, otherwise `false`.
   */
  isConnected() {
    return this.signer !== null
  }

  /**
   * Disconnect wallet
   * Resets the provider, signer, and other related properties to their initial state.
   */
  disconnect() {
    this.provider = null
    this.signer = null
    this.contracts = {}
    this.network = null
  }

  /**
   * Registers a callback function to be executed when the connected account changes.
   * @param {(accounts: string[]) => void} callback - The function to call with the new array of accounts.
   */
  onAccountsChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback)
    }
  }

  /**
   * Registers a callback function to be executed when the network (chain) changes.
   * @param {(chainId: string) => void} callback - The function to call with the new chain ID.
   */
  onChainChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback)
    }
  }

  /**
   * Removes all previously registered 'accountsChanged' and 'chainChanged' listeners.
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