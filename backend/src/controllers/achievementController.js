const Pet = require('../models/Pet');
const User = require('../models/User');
const GameEvent = require('../models/GameEvent');

class AchievementController {
  // Achievement definitions
  static achievements = {
    FIRST_PET: {
      id: 'first_pet',
      name: 'First Companion',
      description: 'Create your first pet',
      icon: '🐣',
      points: 10,
    },
    CARETAKER: {
      id: 'caretaker',
      name: 'Dedicated Caretaker',
      description: 'Care for your pet for 7 consecutive days',
      icon: '💖',
      points: 25,
    },
    EXPLORER: {
      id: 'explorer',
      name: 'Activity Explorer',
      description: 'Try all different types of activities',
      icon: '🎯',
      points: 15,
    },
    TRAINER: {
      id: 'trainer',
      name: 'Master Trainer',
      description: 'Reach level 10 with any pet',
      icon: '⭐',
      points: 50,
    },
    SOCIAL_BUTTERFLY: {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Send 50 kindness actions to other players',
      icon: '🦋',
      points: 30,
    },
    MEDITATION_MASTER: {
      id: 'meditation_master',
      name: 'Zen Master',
      description: 'Complete 100 meditation sessions',
      icon: '🧘',
      points: 40,
    },
    PERFECT_CARE: {
      id: 'perfect_care',
      name: 'Perfect Caretaker',
      description: 'Maintain all pet stats above 80 for 24 hours',
      icon: '👑',
      points: 75,
    },
  };

  // Check and award achievements for a user
  static async checkAchievements(walletAddress) {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) return [];

      const pets = await Pet.find({ owner: walletAddress });
      const events = await GameEvent.find({ 
        petId: { $in: pets.map(p => p._id) } 
      });

      const unlocked = [];
      const userAchievements = user.achievements || [];

      // Check each achievement
      for (const [key, achievement] of Object.entries(this.achievements)) {
        if (userAchievements.includes(achievement.id)) continue;

        const isUnlocked = await this.checkAchievement(achievement.id, pets, events, user);
        if (isUnlocked) {
          unlocked.push(achievement);
          userAchievements.push(achievement.id);
        }
      }

      // Update user if new achievements unlocked
      if (unlocked.length > 0) {
        user.achievements = userAchievements;
        user.achievementPoints = (user.achievementPoints || 0) + 
          unlocked.reduce((sum, ach) => sum + ach.points, 0);
        await user.save();
      }

      return unlocked;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  // Check specific achievement conditions
  static async checkAchievement(achievementId, pets, events, user) {
    switch (achievementId) {
      case 'first_pet':
        return pets.length > 0;

      case 'caretaker':
        return user.streak >= 7;

      case 'explorer':
        const activityTypes = new Set(events.map(e => e.type));
        return activityTypes.size >= 5;

      case 'trainer':
        return pets.some(pet => pet.level >= 10);

      case 'social_butterfly':
        const kindnessActions = events.filter(e => e.type === 'social').length;
        return kindnessActions >= 50;

      case 'meditation_master':
        const meditations = events.filter(e => e.type === 'meditate').length;
        return meditations >= 100;

      case 'perfect_care':
        // This would require more complex tracking
        return false;

      default:
        return false;
    }
  }

  // Get user's achievements
  static async getUserAchievements(req, res) {
    try {
      const { walletAddress } = req.params;

      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const userAchievements = user.achievements || [];
      const achievements = userAchievements.map(achId => 
        this.achievements[achId.toUpperCase()]
      ).filter(Boolean);

      const recentUnlocks = await this.checkAchievements(walletAddress);

      res.json({
        success: true,
        data: {
          achievements,
          totalPoints: user.achievementPoints || 0,
          recentUnlocks,
          progress: await this.getAchievementProgress(walletAddress),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching achievements',
        error: error.message,
      });
    }
  }

  // Get achievement progress
  static async getAchievementProgress(walletAddress) {
    const user = await User.findOne({ walletAddress });
    const pets = await Pet.find({ owner: walletAddress });
    const events = await GameEvent.find({ 
      petId: { $in: pets.map(p => p._id) } 
    });

    const progress = {};

    for (const [key, achievement] of Object.entries(this.achievements)) {
      if (user.achievements?.includes(achievement.id)) {
        progress[achievement.id] = { completed: true, progress: 100 };
      } else {
        const currentProgress = await this.calculateProgress(achievement.id, pets, events, user);
        progress[achievement.id] = { completed: false, progress: currentProgress };
      }
    }

    return progress;
  }

  // Calculate progress percentage for an achievement
  static async calculateProgress(achievementId, pets, events, user) {
    switch (achievementId) {
      case 'caretaker':
        return Math.min(100, (user.streak / 7) * 100);

      case 'explorer':
        const activityTypes = new Set(events.map(e => e.type));
        return Math.min(100, (activityTypes.size / 5) * 100);

      case 'trainer':
        const maxLevel = Math.max(...pets.map(p => p.level), 0);
        return Math.min(100, (maxLevel / 10) * 100);

      case 'social_butterfly':
        const kindnessActions = events.filter(e => e.type === 'social').length;
        return Math.min(100, (kindnessActions / 50) * 100);

      case 'meditation_master':
        const meditations = events.filter(e => e.type === 'meditate').length;
        return Math.min(100, (meditations / 100) * 100);

      default:
        return 0;
    }
  }
}

module.exports = AchievementController;