const User = require('../models/User');
const PurchaseHistory = require('../models/PurchaseHistory');

class CurrencyService {
  // Get user currency balance
  static async getBalance(walletAddress) {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) {
        throw new Error('User not found');
      }

      return {
        coins: user.coins || 0,
        tokens: user.tokens || 0,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  // Add currency to user
  static async addCurrency(walletAddress, currencyType, amount, source = 'system') {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) {
        throw new Error('User not found');
      }

      const field = currencyType === 'tokens' ? 'tokens' : 'coins';
      const currentBalance = user[field] || 0;
      user[field] = currentBalance + amount;

      await user.save();

      // Record transaction
      await PurchaseHistory.recordPurchase({
        userId: walletAddress,
        type: 'reward',
        itemId: `currency_${currencyType}`,
        itemType: 'currency',
        quantity: amount,
        price: { amount: 0, currency: currencyType },
        metadata: {
          source,
          transactionType: 'credit',
          previousBalance: currentBalance,
          newBalance: user[field],
        },
      });

      return {
        success: true,
        currencyType,
        amount,
        previousBalance: currentBalance,
        newBalance: user[field],
        source,
      };
    } catch (error) {
      console.error('Error adding currency:', error);
      throw new Error(`Failed to add currency: ${error.message}`);
    }
  }

  // Deduct currency from user
  static async deductCurrency(walletAddress, currencyType, amount, reason = 'purchase') {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) {
        throw new Error('User not found');
      }

      const field = currencyType === 'tokens' ? 'tokens' : 'coins';
      const currentBalance = user[field] || 0;

      if (currentBalance < amount) {
        throw new Error('Insufficient balance');
      }

      user[field] = currentBalance - amount;
      await user.save();

      // Record transaction
      await PurchaseHistory.recordPurchase({
        userId: walletAddress,
        type: 'shop',
        itemId: `currency_deduction_${currencyType}`,
        itemType: 'currency',
        quantity: amount,
        price: { amount: -amount, currency: currencyType },
        metadata: {
          reason,
          transactionType: 'debit',
          previousBalance: currentBalance,
          newBalance: user[field],
        },
      });

      return {
        success: true,
        currencyType,
        amount,
        previousBalance: currentBalance,
        newBalance: user[field],
        reason,
      };
    } catch (error) {
      console.error('Error deducting currency:', error);
      throw new Error(`Failed to deduct currency: ${error.message}`);
    }
  }

  // Transfer currency between users
  static async transferCurrency(fromWallet, toWallet, currencyType, amount, reason = 'transfer') {
    try {
      // Deduct from sender
      await this.deductCurrency(fromWallet, currencyType, amount, `transfer_to_${toWallet}`);

      // Add to receiver
      await this.addCurrency(toWallet, currencyType, amount, `transfer_from_${fromWallet}`);

      return {
        success: true,
        from: fromWallet,
        to: toWallet,
        currencyType,
        amount,
        reason,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error transferring currency:', error);
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  // Get currency transaction history
  static async getTransactionHistory(walletAddress, options = {}) {
    try {
      const { page = 1, limit = 20, currencyType, transactionType } = options;
      
      const query = { userId: walletAddress };
      
      if (currencyType) {
        query['price.currency'] = currencyType;
      }
      
      if (transactionType) {
        query['metadata.transactionType'] = transactionType;
      }

      const [transactions, total] = await Promise.all([
        PurchaseHistory.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        PurchaseHistory.countDocuments(query),
      ]);

      // Calculate summary
      const summary = await this.calculateTransactionSummary(walletAddress);

      return {
        transactions,
        summary,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw new Error(`Failed to get transaction history: ${error.message}`);
    }
  }

  // Calculate transaction summary
  static async calculateTransactionSummary(walletAddress) {
    const summary = await PurchaseHistory.aggregate([
      { $match: { userId: walletAddress } },
      {
        $group: {
          _id: '$price.currency',
          totalReceived: {
            $sum: {
              $cond: [
                { $gt: ['$price.amount', 0] },
                '$price.amount',
                0,
              ],
            },
          },
          totalSpent: {
            $sum: {
              $cond: [
                { $lt: ['$price.amount', 0] },
                { $multiply: ['$price.amount', -1] },
                0,
              ],
            },
          },
          transactionCount: { $sum: 1 },
        },
      },
    ]);

    return summary.reduce((acc, curr) => {
      acc[curr._id] = {
        totalReceived: curr.totalReceived,
        totalSpent: curr.totalSpent,
        transactionCount: curr.transactionCount,
        netChange: curr.totalReceived - curr.totalSpent,
      };
      return acc;
    }, {});
  }
}

module.exports = CurrencyService;