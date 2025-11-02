const mongoose = require('mongoose');

const questProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  questId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'seasonal'],
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
  },
  target: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    required: false,
  },
  claimed: {
    type: Boolean,
    default: false,
  },
  claimedAt: {
    type: Date,
    required: false,
  },
  resetDate: {
    type: Date,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Compound index for efficient queries
questProgressSchema.index({ userId: 1, questId: 1, resetDate: 1 }, { unique: true });
questProgressSchema.index({ resetDate: 1, completed: 1 });

// Virtual for progress percentage
questProgressSchema.virtual('progressPercentage').get(function() {
  return Math.min(100, Math.round((this.progress / this.target) * 100));
});

// Method to update progress
questProgressSchema.methods.updateProgress = function(newProgress, metadata = {}) {
  this.progress = Math.min(this.target, newProgress);
  this.metadata = { ...this.metadata, ...metadata };
  
  if (this.progress >= this.target && !this.completed) {
    this.completed = true;
    this.completedAt = new Date();
  }
  
  return this.save();
};

// Method to claim reward
questProgressSchema.methods.claimReward = function() {
  if (!this.completed) {
    throw new Error('Quest not completed');
  }
  
  if (this.claimed) {
    throw new Error('Reward already claimed');
  }
  
  this.claimed = true;
  this.claimedAt = new Date();
  return this.save();
};

// Static method to get active quests for user
questProgressSchema.statics.getActiveQuests = function(userId, type = null) {
  const query = { 
    userId, 
    completed: false,
    resetDate: { $gt: new Date() },
  };
  
  if (type) {
    query.type = type;
  }
  
  return this.find(query);
};

module.exports = mongoose.model('QuestProgress', questProgressSchema);