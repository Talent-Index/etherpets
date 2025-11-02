const express = require('express');
const ShopController = require('../controllers/shopController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/items', ShopController.getShopItems);
router.get('/stats', ShopController.getShopStats);

// Protected routes
router.use(authMiddleware);
router.post('/items/:itemId/purchase', ShopController.purchaseItem);
router.get('/history', ShopController.getShopHistory);

module.exports = router;