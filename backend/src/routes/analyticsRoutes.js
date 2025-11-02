const express = require('express');
const AnalyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Analytics routes
router.get('/stats', AnalyticsController.getGameStats);
router.get('/users/:userId', AnalyticsController.getUserAnalytics);
router.get('/pets/:petId', AnalyticsController.getPetAnalytics);

module.exports = router;