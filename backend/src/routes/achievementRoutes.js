const express = require('express');
const AchievementController = require('../controllers/achievementController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Achievement routes
router.get('/:walletAddress', AchievementController.getUserAchievements);

module.exports = router;