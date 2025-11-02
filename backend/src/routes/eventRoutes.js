const express = require('express');
const EventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Public routes
router.get('/stats', EventController.getEventStats);

// Protected routes
router.use(authMiddleware);
router.get('/history', EventController.getUserEventHistory);
router.post('/log', EventController.logCustomEvent);

// Admin routes
router.use(adminMiddleware);
router.post('/cleanup', EventController.cleanupEvents);

module.exports = router;