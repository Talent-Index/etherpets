const User = require('../models/User');
const Pet = require('../models/Pet');
const GameEvent = require('../models/GameEvent');
const NotificationService = require('./notificationService');

class AchievementService {
  // Achievement definitions with complete metadata
  static achievements = {
    FIRST_PET: {
      id: 'first_pet',
      name: 'First Companion',
      description: 'Create your first pet',
      icon: '🐣',
      points: 10,
      rarity: 'common',
      category: 'getting_started',
    },
    CARETAKER: {
      id: 'caretaker',
      name: 'Dedicated Caretaker',
      description: 'Care for your pet for 7 consecutive days',
      icon: '💖',
      points: 25,
      rarity: 'uncommon',
      category: 'dedication',
    },
    EXPLORER: {
      id: 'explorer',
      name: 'Activity Explorer',
      description: 'Try all different types of activities',
      icon: '🎯',
      points: 15,
      rarity: 'common',
      category: 'exploration',
    },
    TRAINER: {
      id: 'trainer',
      name: 'Master Trainer',
      description: 'Reach level 10 with any pet',
      icon: '⭐',
      points: 50,
      rarity: 'rare',
      category: 'progression',
    },
    SOCIAL_BUTTERFLY: {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Send 50 kindness actions to other players',
      icon: '🦋',
      points: 30,
      rarity: 'uncommon',
      category: 'social',
    },
    MEDITATION_MASTER: {
      id: 'meditation_master',
      name: 'Zen Master',
      description: 'Complete 100 meditation sessions',
      icon: '🧘',
      points: 40,
      rarity: 'rare',
      category: 'wellness',
    },
    PERFECT_CARE: {
      id: 'perfect_care',
      name: 'Perfect Caretaker',
      description: 'Maintain all pet stats above 80 for 24 hours',
      icon: '👑',
      points: 75,
      rarity: 'epic',
      category: 'mastery',
    },
    COLLECTOR: {
      id: 'collector',
      name: 'Pet Collector',
      description: 'Own 5 different pets',
      icon: '🏆',
      points: 35,
      rarity: 'uncommon',
      category: 'collection',
    },
    MARATHON: {
      id: 'marathon',
      name: 'Marathon Runner',
      description: 'Maintain a 30-day streak',
      icon: '🏃',
      points: 100,
      rarity: 'legendary',
      category: 'dedication',
    },
    WEALTHY: {
      id: 'wealthy',
      name: 'Coin Master',
      description: 'Accumulate 10,000 coins',
      icon: '💰',
      points: 45,
      rarity: 'rare',
      category: 'economy',
    },
  };

  // Check and award achievements for a user
  static async checkAchievements(walletAddress) {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) return { unlocked: [], total: 0 };

      const pets = await Pet.find({ owner: walletAddress });
      const events = await GameEvent.find({ 
        petId: { $in: pets.map(p => p._id) } 
      });

      const unlocked = [];
      const userAchievements = user.achievements || [];

      // Check each achievement
      for (const [key, achievement] of Object.entries(this.achievements)) {
        if (userAchievements.includes(achievement.id)) continue;

        const isUnlocked = await this.checkAchievement(
          achievement.id, 
          pets, 
          events, 
          user
        );
        
        if (isUnlocked) {
          unlocked.push(achievement);
          userAchievements.push(achievement.id);
        }
      }

      // Update user if new achievements unlocked
      if (unlocked.length > 0) {
        user.achievements = userAchievements;
        const totalPoints = unlocked.reduce((sum, ach) => sum + ach.points, 0);
        user.achievementPoints = (user.achievementPoints || 0) + totalPoints;
        
        // Award coin rewards
        const coinReward = totalPoints * 10; // 10 coins per achievement point
        user.coins = (user.coins || 0) + coinReward;
        
        await user.save();

        // Send notifications for each unlocked achievement
        for (const achievement of unlocked) {
          await NotificationService.createNotification(
            walletAddress,
            'achievement',
            `Achievement Unlocked: ${achievement.name}`,
            `You've earned ${achievement.points} points and ${achievement.points * 10} coins!`,
            { achievement: achievement.id }
          );
        }
      }

      return { unlocked, total: unlocked.length };
    } catch (error) {
      console.error('Error checking achievements:', error);
      return { unlocked: [], total: 0 };
    }
  }

  // Check specific achievement conditions
  static async checkAchievement(achievementId, pets, events, user) {
    try {
      switch (achievementId) {
        case 'first_pet':
          return pets.length > 0;

        case 'caretaker':
          return (user.streak || 0) >= 7;

        case 'explorer': {
          const activityTypes = new Set(events.map(e => e.type));
          return activityTypes.size >= 5;
        }

        case 'trainer':
          return pets.some(pet => pet.level >= 10);

        case 'social_butterfly': {
          const kindnessActions = events.filter(e => e.type === 'social').length;
          return kindnessActions >= 50;
        }

        case 'meditation_master': {
          const meditations = events.filter(e => e.type === 'meditate').length;
          return meditations >= 100;
        }

        case 'perfect_care': {
          // Check if any pet has maintained high stats for 24 hours
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          const recentEvents = events.filter(e => e.timestamp > oneDayAgo);
          
          // This would require more complex tracking in production
          return false; // Placeholder for complex logic
        }

        case 'collector':
          return pets.length >= 5;

        case 'marathon':
          return (user.streak || 0) >= 30;

        case 'wealthy':
          return (user.coins || 0) >= 10000;

        default:
          return false;
      }
    } catch (error) {
      console.error(`Error checking achievement ${achievementId}:`, error);
      return false;
    }
  }

  // Get all achievements with user progress
  static async getUserAchievementsWithProgress(walletAddress) {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) {
        throw new Error('User not found');
      }

      const pets = await Pet.find({ owner: walletAddress });
      const events = await GameEvent.find({ 
        petId: { $in: pets.map(p => p._id) } 
      });

      const userAchievements = user.achievements || [];
      const results = [];

      for (const [key, achievement] of Object.entries(this.achievements)) {
        const isUnlocked = userAchievements.includes(achievement.id);
        const progress = isUnlocked 
          ? 100 
          : await this.calculateProgress(achievement.id, pets, events, user);

        results.push({
          ...achievement,
          unlocked: isUnlocked,
          progress,
          unlockedAt: isUnlocked ? user.updatedAt : null,
        });
      }

      // Sort by unlocked status and then by rarity
      const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
      results.sort((a, b) => {
        if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      });

      return {
        achievements: results,
        summary: {
          totalUnlocked: userAchievements.length,
          totalAvailable: Object.keys(this.achievements).length,
          totalPoints: user.achievementPoints || 0,
          completionRate: (userAchievements.length / Object.keys(this.achievements).length * 100).toFixed(1),
        },
      };
    } catch (error) {
      console.error('Error getting user achievements:', error);
      throw error;
    }
  }

  // Calculate progress percentage for an achievement
  static async calculateProgress(achievementId, pets, events, user) {
    try {
      switch (achievementId) {
        case 'first_pet':
          return pets.length > 0 ? 100 : 0;

        case 'caretaker':
          return Math.min(100, ((user.streak || 0) / 7) * 100);

        case 'explorer': {
          const activityTypes = new Set(events.map(e => e.type));
          return Math.min(100, (activityTypes.size / 5) * 100);
        }

        case 'trainer': {
          const maxLevel = Math.max(...pets.map(p => p.level), 0);
          return Math.min(100, (maxLevel / 10) * 100);
        }

        case 'social_butterfly': {
          const kindnessActions = events.filter(e => e.type === 'social').length;
          return Math.min(100, (kindnessActions / 50) * 100);
        }

        case 'meditation_master': {
          const meditations = events.filter(e => e.type === 'meditate').length;
          return Math.min(100, (meditations / 100) * 100);
        }

        case 'perfect_care':
          return 0; // Complex logic placeholder

        case 'collector':
          return Math.min(100, (pets.length / 5) * 100);

        case 'marathon':
          return Math.min(100, ((user.streak || 0) / 30) * 100);

        case 'wealthy':
          return Math.min(100, ((user.coins || 0) / 10000) * 100);

        default:
          return 0;
      }
    } catch (error) {
      console.error(`Error calculating progress for ${achievementId}:`, error);
      return 0;
    }
  }

  // Get achievement statistics
  static async getAchievementStats() {
    try {
      const users = await User.find({}, 'achievements achievementPoints');
      
      const stats = {
        totalUsers: users.length,
        achievementDistribution: {},
        averagePointsPerUser: 0,
        topAchievers: [],
      };

      // Calculate distribution
      for (const achievement of Object.values(this.achievements)) {
        const unlockedCount = users.filter(u => 
          u.achievements?.includes(achievement.id)
        ).length;
        
        stats.achievementDistribution[achievement.id] = {
          name: achievement.name,
          unlockedCount,
          percentage: users.length > 0 
            ? ((unlockedCount / users.length) * 100).toFixed(1)
            : 0,
        };
      }

      // Calculate average points
      const totalPoints = users.reduce((sum, u) => sum + (u.achievementPoints || 0), 0);
      stats.averagePointsPerUser = users.length > 0 
        ? (totalPoints / users.length).toFixed(1)
        : 0;

      // Get top achievers
      stats.topAchievers = users
        .sort((a, b) => (b.achievementPoints || 0) - (a.achievementPoints || 0))
        .slice(0, 10)
        .map(u => ({
          walletAddress: u.walletAddress,
          username: u.username,
          points: u.achievementPoints || 0,
          achievementsUnlocked: u.achievements?.length || 0,
        }));

      return stats;
    } catch (error) {
      console.error('Error getting achievement stats:', error);
      throw error;
    }
  }

  // Get achievements by category
  static getAchievementsByCategory(category) {
    return Object.values(this.achievements).filter(
      ach => ach.category === category
    );
  }

  // Get achievements by rarity
  static getAchievementsByRarity(rarity) {
    return Object.values(this.achievements).filter(
      ach => ach.rarity === rarity
    );
  }
}

module.exports = AchievementService;
