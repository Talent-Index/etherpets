const express = require('express');
const RewardController = require('../controllers/rewardController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Protected routes
router.use(authMiddleware);
router.post('/daily', RewardController.claimDailyReward);
router.post('/pets/:petId/level-up', RewardController.processLevelUp);

// Admin routes (for manual reward distribution)
router.use(adminMiddleware);
router.post('/pets/:petId/experience', RewardController.awardExperience);
router.post('/users/:walletAddress/coins', RewardController.awardCoins);

module.exports = router;