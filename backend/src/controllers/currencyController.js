const CurrencyService = require('../services/currencyService');

class CurrencyController {
  // Get user balance
  static async getBalance(req, res) {
    try {
      const walletAddress = req.user.walletAddress;

      const balance = await CurrencyService.getBalance(walletAddress);

      res.json({
        success: true,
        data: balance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching balance',
        error: error.message,
      });
    }
  }

  // Get transaction history
  static async getTransactionHistory(req, res) {
    try {
      const walletAddress = req.user.walletAddress;
      const options = req.query;

      const history = await CurrencyService.getTransactionHistory(walletAddress, options);

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching transaction history',
        error: error.message,
      });
    }
  }

  // Add currency (admin only)
  static async addCurrency(req, res) {
    try {
      const { walletAddress } = req.params;
      const { currencyType, amount, source } = req.body;

      const result = await CurrencyService.addCurrency(walletAddress, currencyType, amount, source);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding currency',
        error: error.message,
      });
    }
  }

  // Transfer currency between users
  static async transferCurrency(req, res) {
    try {
      const fromWallet = req.user.walletAddress;
      const { toWallet, currencyType, amount, reason } = req.body;

      const result = await CurrencyService.transferCurrency(
        fromWallet, 
        toWallet, 
        currencyType, 
        amount, 
        reason
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error transferring currency',
        error: error.message,
      });
    }
  }
}

module.exports = CurrencyController;