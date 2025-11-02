const express = require('express');
const GameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Game activity routes
router.get('/pets/:petId/activity', GameController.getPetActivity);
router.post('/pets/:petId/meditate', GameController.meditateWithPet);
router.post('/pets/:petId/train', GameController.trainPet);
router.get('/pets/:petId/insights', GameController.getPetInsights);

module.exports = router;