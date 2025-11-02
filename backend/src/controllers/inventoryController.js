const InventoryItem = require('../models/Inventory');
const Pet = require('../models/Pet');

class InventoryController {
  // Get user inventory
  static async getUserInventory(req, res) {
    try {
      const walletAddress = req.user.walletAddress;
      const { itemType, page = 1, limit = 50 } = req.query;

      const skip = (page - 1) * limit;
      const query = { userId: walletAddress };

      if (itemType) {
        query.itemType = itemType;
      }

      const [items, total] = await Promise.all([
        InventoryItem.find(query)
          .sort({ 'metadata.rarity': -1, quantity: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        InventoryItem.countDocuments(query),
      ]);

      // Filter out expired items
      const validItems = items.filter(item => 
        !item.expiresAt || new Date() < new Date(item.expiresAt)
      );

      // Calculate summary
      const summary = this.calculateInventorySummary(validItems);

      res.json({
        success: true,
        data: {
          items: validItems,
          summary,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching inventory',
        error: error.message,
      });
    }
  }

  // Use item on pet
  static async useItem(req, res) {
    try {
      const { itemId } = req.params;
      const { petId, quantity = 1 } = req.body;
      const walletAddress = req.user.walletAddress;

      // Check if user owns the item
      const inventoryItem = await InventoryItem.findOne({
        userId: walletAddress,
        itemId,
        quantity: { $gte: quantity },
      });

      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          message: 'Item not found or insufficient quantity',
        });
      }

      // Check if item is expired
      if (!inventoryItem.isUsable()) {
        return res.status(400).json({
          success: false,
          message: 'Item has expired',
        });
      }

      // Check if user owns the pet
      const pet = await Pet.findOne({
        _id: petId,
        owner: walletAddress,
      });

      if (!pet) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found or not owned by user',
        });
      }

      // Apply item effects to pet
      const effects = await this.applyItemEffects(pet, inventoryItem, quantity);

      // Reduce item quantity
      await InventoryItem.useItem(walletAddress, itemId, quantity);

      res.json({
        success: true,
        data: {
          item: inventoryItem,
          effects,
          pet: {
            id: pet._id,
            name: pet.name,
            newStats: {
              happiness: pet.happiness,
              energy: pet.energy,
              hunger: pet.hunger,
            },
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error using item',
        error: error.message,
      });
    }
  }

  // Add item to inventory (admin/testing)
  static async addItem(req, res) {
    try {
      const { walletAddress } = req.params;
      const itemData = req.body;

      const item = await InventoryItem.addItem(walletAddress, itemData);

      res.json({
        success: true,
        data: {
          message: 'Item added to inventory',
          item,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding item to inventory',
        error: error.message,
      });
    }
  }

  // Get inventory summary
  static async getInventorySummary(req, res) {
    try {
      const walletAddress = req.user.walletAddress;

      const items = await InventoryItem.find({ userId: walletAddress });
      const summary = this.calculateInventorySummary(items);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching inventory summary',
        error: error.message,
      });
    }
  }

  // Helper methods
  static calculateInventorySummary(items) {
    const summary = {
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      byType: {},
      byRarity: {},
      valuableItems: items.filter(item => 
        ['rare', 'epic', 'legendary'].includes(item.metadata?.rarity)
      ).length,
    };

    items.forEach(item => {
      // Count by type
      summary.byType[item.itemType] = (summary.byType[item.itemType] || 0) + item.quantity;
      
      // Count by rarity
      const rarity = item.metadata?.rarity || 'common';
      summary.byRarity[rarity] = (summary.byRarity[rarity] || 0) + item.quantity;
    });

    return summary;
  }

  static async applyItemEffects(pet, item, quantity) {
    const effects = item.metadata?.effects || {};
    const results = [];

    // Apply stat changes
    if (effects.happiness) {
      const change = effects.happiness * quantity;
      pet.happiness = Math.min(100, pet.happiness + change);
      results.push({ stat: 'happiness', change });
    }

    if (effects.energy) {
      const change = effects.energy * quantity;
      pet.energy = Math.min(100, pet.energy + change);
      results.push({ stat: 'energy', change });
    }

    if (effects.hunger) {
      const change = effects.hunger * quantity;
      pet.hunger = Math.min(100, pet.hunger + change);
      results.push({ stat: 'hunger', change });
    }

    if (effects.experience) {
      const change = effects.experience * quantity;
      const levelResult = pet.addExperience(change);
      results.push({ 
        stat: 'experience', 
        change,
        leveledUp: levelResult.leveledUp,
        newLevel: levelResult.newLevel,
      });
    }

    // Update pet mood
    pet.updateMood();
    await pet.save();

    return results;
  }
}

module.exports = InventoryController;