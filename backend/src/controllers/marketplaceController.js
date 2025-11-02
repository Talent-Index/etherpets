const MarketplaceService = require('../services/marketplaceService');

class MarketplaceController {
  // List pet for adoption
  static async listPet(req, res) {
    try {
      const { petId } = req.params;
      const { price } = req.body;
      const ownerAddress = req.user.walletAddress;

      const result = await MarketplaceService.listPetForAdoption(petId, price, ownerAddress);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error listing pet',
        error: error.message,
      });
    }
  }

  // Remove pet from marketplace
  static async removeListing(req, res) {
    try {
      const { petId } = req.params;
      const ownerAddress = req.user.walletAddress;

      const result = await MarketplaceService.removeFromMarketplace(petId, ownerAddress);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error removing listing',
        error: error.message,
      });
    }
  }

  // Get marketplace listings
  static async getListings(req, res) {
    try {
      const filters = req.query;
      
      const result = await MarketplaceService.getMarketplaceListings(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching listings',
        error: error.message,
      });
    }
  }

  // Purchase pet
  static async purchasePet(req, res) {
    try {
      const { petId } = req.params;
      const { price } = req.body;
      const buyerAddress = req.user.walletAddress;

      const result = await MarketplaceService.purchasePet(petId, buyerAddress, price);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error purchasing pet',
        error: error.message,
      });
    }
  }

  // Get user marketplace activity
  static async getUserActivity(req, res) {
    try {
      const walletAddress = req.user.walletAddress;

      const result = await MarketplaceService.getUserMarketplaceActivity(walletAddress);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user activity',
        error: error.message,
      });
    }
  }

  // Get marketplace statistics
  static async getMarketplaceStats(req, res) {
    try {
      const result = await MarketplaceService.getMarketplaceStats();

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching marketplace stats',
        error: error.message,
      });
    }
  }
}

module.exports = MarketplaceController;