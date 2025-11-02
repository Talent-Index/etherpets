const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', UserController.loginOrCreateUser);

// Protected routes
router.use(authMiddleware);
router.get('/profile', UserController.getUserProfile);
router.put('/profile', UserController.updateUserProfile);
router.get('/stats', UserController.getUserStats);

module.exports = router;