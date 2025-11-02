const express = require('express');
const CurrencyController = require('../controllers/currencyController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Currency routes
router.get('/balance', CurrencyController.getBalance);
router.get('/transactions', CurrencyController.getTransactionHistory);
router.post('/transfer', CurrencyController.transferCurrency);

// Admin routes
router.use(adminMiddleware);
router.post('/users/:walletAddress/add', CurrencyController.addCurrency);

module.exports = router;