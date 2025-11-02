import { ethers } from 'ethers'

// Avalanche Fuji Testnet
const AVALANCHE_TESTNET = {
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

export class BlockchainService {
  constructor() {
    this.provider = null
    this.signer = null
    this.contracts = {}
  }

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      
      // Check if we're on the correct network
      await this.switchToAvalanche()
      
      return await this.signer.getAddress()
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }

  async switchToAvalanche() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_TESTNET.chainId }],
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_TESTNET],
          })
        } catch (addError) {
          throw new Error('Failed to add Avalanche network to MetaMask')
        }
      } else {
        throw switchError
      }
    }
  }

  async getAccount() {
    if (!this.signer) return null
    return await this.signer.getAddress()
  }

  async getBalance() {
    if (!this.signer) return '0'
    const balance = await this.provider.getBalance(await this.signer.getAddress())
    return ethers.formatEther(balance)
  }

  // Contract interactions would go here
  // For example: mintPet, updatePetMood, etc.

  async mintPet(petData) {
    // This would interact with your smart contract
    // For now, we'll simulate the transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hash: '0x' + Math.random().toString(16).substr(2, 64),
          status: 'success',
          tokenId: Math.floor(Math.random() * 1000)
        })
      }, 2000)
    })
  }

  async updatePetMood(petId, mood) {
    // Simulate blockchain transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hash: '0x' + Math.random().toString(16).substr(2, 64),
          status: 'success'
        })
      }, 1000)
    })
  }
}

export const blockchainService = new BlockchainService()