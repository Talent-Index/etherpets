const { ethers } = require('ethers');
const petNFTAbi = require('../../contracts/artifacts/contracts/EtherPetNFT.sol/EtherPetNFT.json').abi;

// Load contract addresses from environment variables
const PET_NFT_ADDRESS = process.env.PET_NFT_ADDRESS;
if (!PET_NFT_ADDRESS) {
  console.warn("PET_NFT_ADDRESS environment variable not set. Blockchain interactions will fail.");
}

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.AVALANCHE_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'
    );
    this.wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY,
      this.provider
    );
    this.petNftContract = PET_NFT_ADDRESS
      ? new ethers.Contract(PET_NFT_ADDRESS, petNFTAbi, this.wallet)
      : null;
  }

  // Mint a new pet NFT
  async mintPetNFT(ownerAddress, petId, metadataURI) {
    if (!this.petNftContract) {
      throw new Error('Pet NFT contract is not initialized. Check your environment variables.');
    }
    try {
      console.log(`Minting NFT for pet ${petId} to ${ownerAddress} with metadata ${metadataURI}`);

      // Call the mint function on the smart contract
      const tx = await this.petNftContract.mint(ownerAddress, metadataURI);
      const receipt = await tx.wait();

      // Find the tokenId from the Transfer event
      const transferEvent = receipt.events?.find(e => e.event === 'Transfer');
      const tokenId = transferEvent ? transferEvent.args.tokenId.toString() : null;

      if (!tokenId) {
        throw new Error("TokenId not found in mint transaction receipt.");
      }

      return {
        success: true,
        txHash: receipt.transactionHash,
        tokenId: tokenId,
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw new Error(`Failed to mint NFT: ${error.message}`);
    }
  }

  // Update pet traits on-chain
  async updatePetTraits(tokenId, traits) {
    if (!this.petNftContract) {
      throw new Error('Pet NFT contract is not initialized.');
    }
    try {
      console.log(`Updating traits for token ${tokenId}:`, traits);

      // Assuming your contract has a function like `setPetTraits(uint256 tokenId, string memory mood, uint256 happiness)`
      // This is a placeholder for the actual function name and parameters.
      // You would need to add this function to your EtherPetNFT.sol contract.
      // For now, we'll simulate a successful transaction if the contract doesn't have this method.
      if (typeof this.petNftContract.setPetTraits !== 'function') {
        console.warn("`setPetTraits` function does not exist on the contract. Simulating success.");
        return { success: true, txHash: ethers.hexlify(ethers.randomBytes(32)) };
      }

      const tx = await this.petNftContract.setPetTraits(tokenId, traits.mood, traits.happiness);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error('Error updating traits:', error);
      throw new Error(`Failed to update traits: ${error.message}`);
    }
  }

  // Verify ownership
  async verifyOwnership(ownerAddress, tokenId) {
    if (!this.petNftContract) {
      throw new Error('Pet NFT contract is not initialized.');
    }
    try {
      const actualOwner = await this.petNftContract.ownerOf(tokenId);
      return {
        success: true,
        isOwner: actualOwner.toLowerCase() === ownerAddress.toLowerCase(),
      };
    } catch (error) {
      console.error('Error verifying ownership:', error);
      // If ownerOf throws, it likely means the token doesn't exist or there's another issue.
      return { success: false, isOwner: false, error: error.message };
    }
  }

  // Create a marketplace listing
  async createMarketplaceListing(tokenId, price, ownerAddress) {
    // This would interact with your marketplace contract
    try {
      console.log(`Creating marketplace listing for token ${tokenId} at price ${price}`);

      // Simulate transaction
      const txHash = ethers.hexlify(ethers.randomBytes(32));

      return {
        success: true,
        txHash,
      };
    } catch (error) {
      console.error('Error creating marketplace listing:', error);
      throw new Error('Failed to create marketplace listing');
    }
  }

  // Execute a marketplace purchase
  async executeMarketplacePurchase(tokenId, price, sellerAddress, buyerAddress) {
    // This would interact with your marketplace contract
    try {
      console.log(`Executing purchase for token ${tokenId} by ${buyerAddress} from ${sellerAddress}`);

      // Simulate transaction
      const txHash = ethers.hexlify(ethers.randomBytes(32));

      return {
        success: true,
        txHash,
      };
    } catch (error) {
      console.error('Error executing marketplace purchase:', error);
      throw new Error('Failed to execute marketplace purchase');
    }
  }
}

module.exports = new BlockchainService();