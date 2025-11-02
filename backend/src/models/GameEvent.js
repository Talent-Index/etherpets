const mongoose = require('mongoose');

const gameEventSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'feed',
      'play',
      'rest',
      'meditate',
      'groom',
      'train',
      'social',
      'experience',
      'level_up',
      'decay',
      'notification',
      'achievement',
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  energyChange: {
    type: Number,
    default: 0,
  },
  hungerChange: {
    type: Number,
    default: 0,
  },
  happinessChange: {
    type: Number,
    default: 0,
  },
  experienceGained: {
    type: Number,
    default: 0,
  },
  hiddenTraitsChange: {
    trust: { type: Number, default: 0 },
    empathy: { type: Number, default: 0 },
    curiosity: { type: Number, default: 0 },
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GameEvent', gameEventSchema);