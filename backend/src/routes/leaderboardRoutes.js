const express = require('express');
const LeaderboardController = require('../controllers/leaderboardController');

const router = express.Router();

// Public leaderboard routes
router.get('/pets', LeaderboardController.getPetLeaderboards);
router.get('/users', LeaderboardController.getUserLeaderboards);
router.get('/combined', LeaderboardController.getCombinedLeaderboards);
router.get('/users/:walletAddress/rank', LeaderboardController.getUserRank);
router.get('/season/:seasonId', LeaderboardController.getSeasonalLeaderboard);

module.exports = router;