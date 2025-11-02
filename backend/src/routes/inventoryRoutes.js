const express = require('express');
const InventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Inventory routes
router.get('/', InventoryController.getUserInventory);
router.get('/summary', InventoryController.getInventorySummary);
router.post('/items/:itemId/use', InventoryController.useItem);

// Admin routes
router.use(adminMiddleware);
router.post('/users/:walletAddress/items', InventoryController.addItem);

module.exports = router;