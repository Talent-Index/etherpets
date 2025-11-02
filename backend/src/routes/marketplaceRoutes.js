const express = require('express');
const MarketplaceController = require('../controllers/marketplaceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/listings', MarketplaceController.getListings);
router.get('/stats', MarketplaceController.getMarketplaceStats);

// Protected routes
router.use(authMiddleware);
router.post('/pets/:petId/list', MarketplaceController.listPet);
router.delete('/pets/:petId/list', MarketplaceController.removeListing);
router.post('/pets/:petId/purchase', MarketplaceController.purchasePet);
router.get('/user/activity', MarketplaceController.getUserActivity);

module.exports = router;