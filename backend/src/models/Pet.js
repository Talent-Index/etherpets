const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: String,
    required: true,
    ref: 'User',
  },
  nftId: {
    type: String,
    unique: true,
    sparse: true,
  },
  species: {
    type: String,
    enum: ['dragon', 'phoenix', 'unicorn', 'griffin', 'spirit'],
    default: 'spirit',
  },
  mood: {
    type: String,
    enum: ['happy', 'calm', 'sad', 'excited', 'tired', 'hungry'],
    default: 'calm',
  },
  energy: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  hunger: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  happiness: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  level: {
    type: Number,
    default: 1,
  },
  experience: {
    type: Number,
    default: 0,
  },
  lastFed: {
    type: Date,
    default: Date.now,
  },
  lastPlayed: {
    type: Date,
    default: Date.now,
  },
  birthDate: {
    type: Date,
    default: Date.now,
  },
  traits: {
    color: String,
    pattern: String,
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
  },
  hiddenTraits: {
    trust: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    empathy: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    curiosity: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
  },
}, {
  timestamps: true,
});

// Update mood based on stats
petSchema.methods.updateMood = function() {
  if (this.hunger < 30) {
    this.mood = 'hungry';
  } else if (this.energy < 20) {
    this.mood = 'tired';
  } else if (this.happiness > 80) {
    this.mood = 'excited';
  } else if (this.happiness > 50) {
    this.mood = 'happy';
  } else {
    this.mood = 'sad';
  }
  return this.mood;
};

// Add experience and check for level up
petSchema.methods.addExperience = function(exp) {
  this.experience += exp;
  const requiredExp = this.level * 100;
  if (this.experience >= requiredExp) {
    this.level += 1;
    this.experience = this.experience - requiredExp;
    return { leveledUp: true, newLevel: this.level };
  }
  return { leveledUp: false };
};

module.exports = mongoose.model('Pet', petSchema);