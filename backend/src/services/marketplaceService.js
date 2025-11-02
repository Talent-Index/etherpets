const Pet = require('../models/Pet');
const User = require('../models/User');
const blockchainService = require('./blockchainService');

class MarketplaceService {
  // List pet for adoption/trading
  static async listPetForAdoption(petId, price, ownerAddress) {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) {
        throw new Error('Pet not found');
      }

      if (pet.owner.toLowerCase() !== ownerAddress.toLowerCase()) {
        throw new Error('Not pet owner');
      }

      // Update pet listing status
      pet.marketplace = {
        listed: true,
        price: price,
        listedAt: new Date(),
        type: 'adoption',
      };

      await pet.save();

      // In a real implementation, this would create a blockchain listing
      const listingResult = await blockchainService.createMarketplaceListing(
        pet.nftId,
        price,
        ownerAddress
      );

      return {
        success: true,
        listing: {
          petId: pet._id,
          price,
          listedAt: pet.marketplace.listedAt,
          transactionHash: listingResult.txHash,
        },
      };
    } catch (error) {
      console.error('Error listing pet:', error);
      throw new Error(`Failed to list pet: ${error.message}`);
    }
  }

  // Remove pet from marketplace
  static async removeFromMarketplace(petId, ownerAddress) {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) {
        throw new Error('Pet not found');
      }

      if (pet.owner.toLowerCase() !== ownerAddress.toLowerCase()) {
        throw new Error('Not pet owner');
      }

      pet.marketplace = {
        listed: false,
        price: 0,
        listedAt: null,
      };

      await pet.save();

      return {
        success: true,
        message: 'Pet removed from marketplace',
      };
    } catch (error) {
      console.error('Error removing pet from marketplace:', error);
      throw new Error(`Failed to remove pet: ${error.message}`);
    }
  }

  // Get marketplace listings
  static async getMarketplaceListings(filters = {}) {
    try {
      const {
        type = 'adoption',
        species,
        minLevel = 1,
        maxLevel = 100,
        minPrice = 0,
        maxPrice = Number.MAX_SAFE_INTEGER,
        sortBy = 'listedAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20,
      } = filters;

      const query = {
        'marketplace.listed': true,
        'marketplace.type': type,
        'marketplace.price': { $gte: minPrice, $lte: maxPrice },
        level: { $gte: minLevel, $lte: maxLevel },
      };

      if (species) {
        query.species = species;
      }

      const skip = (page - 1) * limit;

      const listings = await Pet.find(query)
        .sort({ [`marketplace.${sortBy}`]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .populate('owner', 'username walletAddress')
        .lean();

      const total = await Pet.countDocuments(query);

      return {
        listings: listings.map(listing => ({
          ...listing,
          price: listing.marketplace.price,
          listedAt: listing.marketplace.listedAt,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
      throw new Error(`Failed to fetch listings: ${error.message}`);
    }
  }

  // Purchase pet from marketplace
  static async purchasePet(petId, buyerAddress, price) {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) {
        throw new Error('Pet not found');
      }

      if (!pet.marketplace.listed) {
        throw new Error('Pet is not listed for sale');
      }

      if (pet.marketplace.price !== price) {
        throw new Error('Price mismatch');
      }

      if (pet.owner.toLowerCase() === buyerAddress.toLowerCase()) {
        throw new Error('Cannot purchase your own pet');
      }

      // In a real implementation, this would handle the blockchain transaction
      const purchaseResult = await blockchainService.executeMarketplacePurchase(
        pet.nftId,
        price,
        pet.owner,
        buyerAddress
      );

      // Update pet ownership
      const previousOwner = pet.owner;
      pet.owner = buyerAddress;
      pet.marketplace = {
        listed: false,
        price: 0,
        listedAt: null,
      };

      await pet.save();

      return {
        success: true,
        purchase: {
          petId: pet._id,
          previousOwner,
          newOwner: buyerAddress,
          price,
          transactionHash: purchaseResult.txHash,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      console.error('Error purchasing pet:', error);
      throw new Error(`Failed to purchase pet: ${error.message}`);
    }
  }

  // Get user's marketplace activity
  static async getUserMarketplaceActivity(walletAddress) {
    try {
      const [listings, purchases] = await Promise.all([
        Pet.find({
          owner: walletAddress,
          'marketplace.listed': true,
        }),
        // In a real implementation, this would query purchase history
        this.getUserPurchaseHistory(walletAddress),
      ]);

      return {
        activeListings: listings,
        purchaseHistory: purchases,
        totalListed: listings.length,
        totalPurchased: purchases.length,
      };
    } catch (error) {
      console.error('Error fetching user marketplace activity:', error);
      throw new Error(`Failed to fetch activity: ${error.message}`);
    }
  }

  // Get marketplace statistics
  static async getMarketplaceStats() {
    try {
      const [
        totalListings,
        totalSales,
        averagePrice,
        popularSpecies,
      ] = await Promise.all([
        Pet.countDocuments({ 'marketplace.listed': true }),
        // This would come from a sales history collection
        this.getTotalSales(),
        Pet.aggregate([
          { $match: { 'marketplace.listed': true } },
          { $group: { _id: null, avgPrice: { $avg: '$marketplace.price' } } },
        ]),
        Pet.aggregate([
          { $match: { 'marketplace.listed': true } },
          { $group: { _id: '$species', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),
      ]);

      return {
        totalListings,
        totalSales,
        averagePrice: averagePrice[0]?.avgPrice || 0,
        popularSpecies,
        updated: new Date(),
      };
    } catch (error) {
      console.error('Error fetching marketplace stats:', error);
      throw new Error(`Failed to fetch stats: ${error.message}`);
    }
  }

  // Helper methods (stubs for blockchain integration)
  static async getUserPurchaseHistory(walletAddress) {
    // This would query a separate purchase history collection
    return [];
  }

  static async getTotalSales() {
    // This would come from sales history
    return 0;
  }
}

module.exports = MarketplaceService;