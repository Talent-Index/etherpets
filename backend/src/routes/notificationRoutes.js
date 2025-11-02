const express = require('express');
const NotificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Notification routes
router.get('/', NotificationController.getUserNotifications);
router.post('/test', NotificationController.createTestNotification);
router.patch('/:notificationId/read', NotificationController.markAsRead);
router.patch('/read-all', NotificationController.markAllAsRead);
router.delete('/:notificationId', NotificationController.deleteNotification);
router.delete('/', NotificationController.clearAllNotifications);

module.exports = router;