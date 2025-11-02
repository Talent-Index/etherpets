const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seasonId: {
    type: String,
    required: true,
    unique: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rewards: {
    topPlayers: [{
      rank: Number,
      reward: {
        type: {
          type: String,
          enum: ['experience', 'coins', 'item'],
        },
        value: Number,
        itemId: String,
      },
    }],
    participation: {
      type: {
        type: String,
        enum: ['experience', 'coins'],
      },
      value: Number,
    },
  },
  leaderboard: {
    type: Map,
    of: {
      walletAddress: String,
      score: Number,
      rank: Number,
      rewardsClaimed: Boolean,
    },
  },
  active: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for active seasons
seasonSchema.index({ active: 1 });
seasonSchema.index({ startDate: 1, endDate: 1 });

// Virtual for season duration
seasonSchema.virtual('durationDays').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Method to check if season is currently active
seasonSchema.methods.isActive = function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
};

// Method to update leaderboard
seasonSchema.methods.updateLeaderboard = async function(walletAddress, score) {
  this.leaderboard.set(walletAddress, {
    walletAddress,
    score: Math.max(score, this.leaderboard.get(walletAddress)?.score || 0),
    rank: 0, // Will be calculated
    rewardsClaimed: this.leaderboard.get(walletAddress)?.rewardsClaimed || false,
  });
  
  // Recalculate ranks
  await this.calculateRanks();
  return this.save();
};

// Method to calculate ranks based on scores
seasonSchema.methods.calculateRanks = function() {
  const entries = Array.from(this.leaderboard.entries())
    .sort((a, b) => b[1].score - a[1].score);
  
  entries.forEach(([key, entry], index) => {
    entry.rank = index + 1;
    this.leaderboard.set(key, entry);
  });
};

module.exports = mongoose.model('Season', seasonSchema);