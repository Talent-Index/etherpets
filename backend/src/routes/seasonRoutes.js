const express = require('express');
const SeasonController = require('../controllers/seasonController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', SeasonController.getAllSeasons);
router.get('/current', SeasonController.getCurrentSeason);
router.get('/:seasonId/leaderboard', SeasonController.getSeasonLeaderboard);

// Protected routes
router.use(authMiddleware);
router.get('/:seasonId/progress', SeasonController.getUserSeasonProgress);
router.post('/:seasonId/claim-rewards', SeasonController.claimSeasonRewards);

module.exports = router;