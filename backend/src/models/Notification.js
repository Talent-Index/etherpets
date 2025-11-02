const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  type: {
    type: String,
    required: true,
    enum: [
      'pet_care',
      'achievement',
      'marketplace',
      'social',
      'system',
      'quest',
      'season',
    ],
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  read: {
    type: Boolean,
    default: false,
  },
  actionRequired: {
    type: Boolean,
    default: false,
  },
  actionUrl: {
    type: String,
    required: false,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create notification
notificationSchema.statics.createNotification = function(notificationData) {
  return this.create(notificationData);
};

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  return this.save();
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ userId, read: false });
};

module.exports = mongoose.model('Notification', notificationSchema);