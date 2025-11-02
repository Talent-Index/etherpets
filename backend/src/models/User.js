const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  streak: {
    type: Number,
    default: 0,
  },
  totalPlayTime: {
    type: Number,
    default: 0,
  },
  preferences: {
    theme: {
      type: String,
      default: 'dark',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
});

// Index for faster queries
userSchema.index({ walletAddress: 1 });

module.exports = mongoose.model('User', userSchema);