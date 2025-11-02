const ShopService = require('../services/shopService');

class ShopController {
  // Get shop items
  static async getShopItems(req, res) {
    try {
      const filters = req.query;
      
      const items = await ShopService.getShopItems(filters);

      res.json({
        success: true,
        data: {
          items,
          filters,
          total: items.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching shop items',
        error: error.message,
      });
    }
  }

  // Purchase item from shop
  static async purchaseItem(req, res) {
    try {
      const { itemId } = req.params;
      const { quantity = 1 } = req.body;
      const walletAddress = req.user.walletAddress;

      const result = await ShopService.purchaseItem(walletAddress, itemId, quantity);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error purchasing item',
        error: error.message,
      });
    }
  }

  // Get user shop history
  static async getShopHistory(req, res) {
    try {
      const walletAddress = req.user.walletAddress;
      const options = req.query;

      const history = await ShopService.getUserShopHistory(walletAddress, options);

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching shop history',
        error: error.message,
      });
    }
  }

  // Get shop statistics
  static async getShopStats(req, res) {
    try {
      const stats = await ShopService.getShopStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching shop statistics',
        error: error.message,
      });
    }
  }
}

module.exports = ShopController;