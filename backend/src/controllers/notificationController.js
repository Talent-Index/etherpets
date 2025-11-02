const Notification = require('../models/Notification');
const NotificationService = require('../services/notificationService');

class NotificationController {
  // Get user notifications
  static async getUserNotifications(req, res) {
    try {
      const walletAddress = req.user.walletAddress;
      const { 
        page = 1, 
        limit = 20, 
        unreadOnly = false,
        type 
      } = req.query;

      const skip = (page - 1) * limit;
      const query = { userId: walletAddress };

      if (unreadOnly) {
        query.read = false;
      }

      if (type) {
        query.type = type;
      }

      const [notifications, total, unreadCount] = await Promise.all([
        Notification.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Notification.countDocuments(query),
        Notification.getUnreadCount(walletAddress),
      ]);

      res.json({
        success: true,
        data: {
          notifications,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
          },
          unreadCount,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching notifications',
        error: error.message,
      });
    }
  }

  // Mark notification as read
  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const walletAddress = req.user.walletAddress;

      const notification = await Notification.findOne({
        _id: notificationId,
        userId: walletAddress,
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found',
        });
      }

      await notification.markAsRead();

      res.json({
        success: true,
        data: {
          message: 'Notification marked as read',
          notification,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error marking notification as read',
        error: error.message,
      });
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(req, res) {
    try {
      const walletAddress = req.user.walletAddress;

      const result = await Notification.updateMany(
        { userId: walletAddress, read: false },
        { $set: { read: true } }
      );

      res.json({
        success: true,
        data: {
          message: 'All notifications marked as read',
          modifiedCount: result.modifiedCount,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error marking all notifications as read',
        error: error.message,
      });
    }
  }

  // Delete notification
  static async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      const walletAddress = req.user.walletAddress;

      const result = await Notification.deleteOne({
        _id: notificationId,
        userId: walletAddress,
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found',
        });
      }

      res.json({
        success: true,
        data: {
          message: 'Notification deleted successfully',
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting notification',
        error: error.message,
      });
    }
  }

  // Clear all notifications
  static async clearAllNotifications(req, res) {
    try {
      const walletAddress = req.user.walletAddress;

      const result = await Notification.deleteMany({
        userId: walletAddress,
      });

      res.json({
        success: true,
        data: {
          message: 'All notifications cleared',
          deletedCount: result.deletedCount,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error clearing notifications',
        error: error.message,
      });
    }
  }

  // Create test notification (for development)
  static async createTestNotification(req, res) {
    try {
      const walletAddress = req.user.walletAddress;
      const { type = 'system', title, message } = req.body;

      const notification = await Notification.createNotification({
        userId: walletAddress,
        type,
        title: title || 'Test Notification',
        message: message || 'This is a test notification',
        priority: 'medium',
        data: { test: true },
      });

      // Emit real-time notification
      if (global.socketService) {
        global.socketService.sendToUser(walletAddress, 'notification:new', notification);
      }

      res.json({
        success: true,
        data: {
          message: 'Test notification created',
          notification,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating test notification',
        error: error.message,
      });
    }
  }
}

module.exports = NotificationController;