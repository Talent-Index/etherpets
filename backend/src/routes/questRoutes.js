const express = require('express');
const QuestController = require('../controllers/questController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Quest routes
router.get('/', QuestController.getUserQuests);
router.get('/refresh', QuestController.refreshQuests);
router.get('/:questId/check', QuestController.checkQuestProgress);
router.post('/:questId/claim', QuestController.claimQuestReward);

module.exports = router;