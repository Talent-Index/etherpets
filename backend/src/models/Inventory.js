const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  itemId: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    enum: ['food', 'toy', 'cosmetic', 'evolution', 'special'],
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0,
  },
  metadata: {
    name: String,
    description: String,
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
    effects: mongoose.Schema.Types.Mixed,
    imageUrl: String,
  },
  acquiredAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
inventoryItemSchema.index({ userId: 1, itemType: 1 });
inventoryItemSchema.index({ userId: 1, itemId: 1 }, { unique: true });
inventoryItemSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to add item to inventory
inventoryItemSchema.statics.addItem = function(userId, itemData) {
  return this.findOneAndUpdate(
    { userId, itemId: itemData.itemId },
    { 
      $setOnInsert: {
        userId,
        itemId: itemData.itemId,
        itemType: itemData.itemType,
        metadata: itemData.metadata,
        acquiredAt: new Date(),
      },
      $inc: { quantity: itemData.quantity || 1 },
      $set: { expiresAt: itemData.expiresAt },
    },
    { 
      upsert: true, 
      new: true,
      setDefaultsOnInsert: true 
    }
  );
};

// Static method to use item
inventoryItemSchema.statics.useItem = function(userId, itemId, quantity = 1) {
  return this.findOneAndUpdate(
    { userId, itemId, quantity: { $gte: quantity } },
    { $inc: { quantity: -quantity } },
    { new: true }
  );
};

// Method to check if item is usable
inventoryItemSchema.methods.isUsable = function() {
  if (this.expiresAt && new Date() > this.expiresAt) {
    return false;
  }
  return this.quantity > 0;
};

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);