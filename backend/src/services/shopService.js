const InventoryItem = require('../models/Inventory');
const PurchaseHistory = require('../models/PurchaseHistory');
const User = require('../models/User');

class ShopService {
  // Shop items configuration
  static shopItems = {
    // Food items
    'apple': {
      id: 'apple',
      name: 'Fresh Apple',
      description: 'A crisp, juicy apple that restores hunger',
      type: 'food',
      price: { amount: 10, currency: 'coins' },
      effects: { hunger: 15, happiness: 5 },
      rarity: 'common',
      stock: -1, // Unlimited
    },
    'premium_food': {
      id: 'premium_food',
      name: 'Premium Pet Food',
      description: 'Nutritious meal that greatly restores hunger and energy',
      type: 'food',
      price: { amount: 25, currency: 'coins' },
      effects: { hunger: 30, energy: 15, happiness: 10 },
      rarity: 'uncommon',
      stock: 100,
    },
    'energy_elixir': {
      id: 'energy_elixir',
      name: 'Energy Elixir',
      description: 'Magical potion that restores pet energy',
      type: 'food',
      price: { amount: 50, currency: 'coins' },
      effects: { energy: 40 },
      rarity: 'rare',
      stock: 50,
    },

    // Toys
    'ball': {
      id: 'ball',
      name: 'Bouncy Ball',
      description: 'A fun toy that increases happiness',
      type: 'toy',
      price: { amount: 15, currency: 'coins' },
      effects: { happiness: 20, energy: -10 },
      rarity: 'common',
      stock: -1,
    },
    'puzzle_toy': {
      id: 'puzzle_toy',
      name: 'Puzzle Toy',
      description: 'Interactive toy that boosts intelligence',
      type: 'toy',
      price: { amount: 40, currency: 'coins' },
      effects: { happiness: 15, curiosity: 10 },
      rarity: 'uncommon',
      stock: 75,
    },

    // Cosmetics
    'rainbow_collar': {
      id: 'rainbow_collar',
      name: 'Rainbow Collar',
      description: 'A colorful collar for your pet',
      type: 'cosmetic',
      price: { amount: 100, currency: 'coins' },
      effects: { happiness: 5 },
      rarity: 'rare',
      stock: 25,
    },
    'golden_halo': {
      id: 'golden_halo',
      name: 'Golden Halo',
      description: 'A divine halo that makes your pet look angelic',
      type: 'cosmetic',
      price: { amount: 500, currency: 'coins' },
      effects: { happiness: 10, trust: 5 },
      rarity: 'epic',
      stock: 10,
    },
  };

  // Get available shop items
  static async getShopItems(filters = {}) {
    let items = Object.values(this.shopItems);

    // Apply filters
    if (filters.type) {
      items = items.filter(item => item.type === filters.type);
    }

    if (filters.rarity) {
      items = items.filter(item => item.rarity === filters.rarity);
    }

    if (filters.maxPrice) {
      items = items.filter(item => item.price.amount <= filters.maxPrice);
    }

    // Check stock availability
    items = items.filter(item => item.stock === -1 || item.stock > 0);

    return items.sort((a, b) => a.price.amount - b.price.amount);
  }

  // Purchase item from shop
  static async purchaseItem(walletAddress, itemId, quantity = 1) {
    try {
      const item = this.shopItems[itemId];
      if (!item) {
        throw new Error('Item not found in shop');
      }

      // Check stock
      if (item.stock !== -1 && item.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      // Get user and check balance
      const user = await User.findOne({ walletAddress });
      if (!user) {
        throw new Error('User not found');
      }

      const totalCost = item.price.amount * quantity;
      if ((user.coins || 0) < totalCost) {
        throw new Error('Insufficient coins');
      }

      // Deduct coins
      user.coins -= totalCost;
      await user.save();

      // Add item to inventory
      const inventoryItem = await InventoryItem.addItem(walletAddress, {
        itemId: item.id,
        itemType: item.type,
        quantity,
        metadata: {
          name: item.name,
          description: item.description,
          rarity: item.rarity,
          effects: item.effects,
        },
      });

      // Record purchase
      await PurchaseHistory.recordPurchase({
        userId: walletAddress,
        type: 'shop',
        itemId: item.id,
        itemType: item.type,
        quantity,
        price: {
          amount: totalCost,
          currency: item.price.currency,
        },
        metadata: {
          itemName: item.name,
          unitPrice: item.price.amount,
        },
      });

      // Update stock if limited
      if (item.stock !== -1) {
        // This would update the shopItems configuration
        // In a real implementation, you'd have a database for shop items
        item.stock -= quantity;
      }

      return {
        success: true,
        purchase: {
          item: inventoryItem,
          cost: totalCost,
          remainingBalance: user.coins,
        },
      };
    } catch (error) {
      console.error('Error purchasing item:', error);
      throw new Error(`Purchase failed: ${error.message}`);
    }
  }

  // Get user purchase history from shop
  static async getUserShopHistory(walletAddress, options = {}) {
    return PurchaseHistory.getUserHistory(walletAddress, {
      ...options,
      type: 'shop',
    });
  }

  // Get shop statistics
  static async getShopStats() {
    const items = Object.values(this.shopItems);
    
    return {
      totalItems: items.length,
      byType: items.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {}),
      byRarity: items.reduce((acc, item) => {
        acc[item.rarity] = (acc[item.rarity] || 0) + 1;
        return acc;
      }, {}),
      priceRange: {
        min: Math.min(...items.map(item => item.price.amount)),
        max: Math.max(...items.map(item => item.price.amount)),
        average: items.reduce((sum, item) => sum + item.price.amount, 0) / items.length,
      },
    };
  }
}

module.exports = ShopService;