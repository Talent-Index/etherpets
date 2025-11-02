const express = require('express');
const PetController = require('../controllers/petController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Pet routes
router.post('/', PetController.createPet);
router.get('/owner/:owner', PetController.getPetByOwner);
router.post('/:petId/feed', PetController.feedPet);
router.post('/:petId/play', PetController.playWithPet);
router.post('/:petId/mood', PetController.updatePetMood); // New route for mood updates
router.post('/:petId/chat', PetController.chatWithPet);

module.exports = router;