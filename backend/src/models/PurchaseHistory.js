const mongoose = require('mongoose');

const purchaseHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['marketplace', 'shop', 'reward', 'trade'],
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    amount: Number,
    currency: {
      type: String,
      enum: ['coins', 'tokens', 'usd'],
      default: 'coins',
    },
  },
  sellerId: {
    type: String,
    required: false,
  },
  transactionHash: {
    type: String,
    required: false,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Index for efficient queries
purchaseHistorySchema.index({ userId: 1, createdAt: -1 });
purchaseHistorySchema.index({ type: 1, itemId: 1 });

// Static method to record purchase
purchaseHistorySchema.statics.recordPurchase = function(purchaseData) {
  return this.create(purchaseData);
};

// Static method to get user purchase history
purchaseHistorySchema.statics.getUserHistory = function(userId, options = {}) {
  const { page = 1, limit = 20, type } = options;
  const skip = (page - 1) * limit;
  
  const query = { userId };
  if (type) query.type = type;

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

// Static method to get purchase statistics
purchaseHistorySchema.statics.getPurchaseStats = function(userId) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$type',
        totalSpent: { $sum: '$price.amount' },
        transactionCount: { $sum: 1 },
        uniqueItems: { $addToSet: '$itemId' },
      },
    },
    {
      $project: {
        type: '$_id',
        totalSpent: 1,
        transactionCount: 1,
        uniqueItemCount: { $size: '$uniqueItems' },
        _id: 0,
      },
    },
  ]);
};

module.exports = mongoose.model('PurchaseHistory', purchaseHistorySchema);