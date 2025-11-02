const Pet = require('../models/Pet');
const User = require('../models/User');
const GameEvent = require('../models/GameEvent');

class QuestService {
  // Daily quest definitions
  static dailyQuests = {
    FEED_PET: {
      id: 'daily_feed',
      name: 'Daily Feeding',
      description: 'Feed your pet 3 times today',
      type: 'daily',
      objective: { type: 'feed', count: 3 },
      reward: { experience: 25, coins: 10 },
    },
    PLAY_SESSION: {
      id: 'daily_play',
      name: 'Play Time',
      description: 'Play with your pet 2 times today',
      type: 'daily',
      objective: { type: 'play', count: 2 },
      reward: { experience: 20, coins: 8 },
    },
    MEDITATION: {
      id: 'daily_meditate',
      name: 'Mindful Moment',
      description: 'Meditate with your pet once today',
      type: 'daily',
      objective: { type: 'meditate', count: 1 },
      reward: { experience: 30, coins: 12 },
    },
    SOCIAL_ACTION: {
      id: 'daily_social',
      name: 'Community Spirit',
      description: 'Send kindness to 3 other players',
      type: 'daily',
      objective: { type: 'social', count: 3 },
      reward: { experience: 35, coins: 15 },
    },
  };

  // Weekly quest definitions
  static weeklyQuests = {
    LEVEL_UP: {
      id: 'weekly_level',
      name: 'Growth Spurt',
      description: 'Level up any pet 3 times this week',
      type: 'weekly',
      objective: { type: 'level_up', count: 3 },
      reward: { experience: 100, coins: 50 },
    },
    VARIETY_ACTIONS: {
      id: 'weekly_variety',
      name: 'Activity Explorer',
      description: 'Perform 5 different types of activities',
      type: 'weekly',
      objective: { type: 'activity_variety', count: 5 },
      reward: { experience: 80, coins: 40 },
    },
    PERFECT_CARE: {
      id: 'weekly_care',
      name: 'Perfect Caretaker',
      description: 'Maintain all pet stats above 80 for 3 consecutive days',
      type: 'weekly',
      objective: { type: 'perfect_care', count: 3 },
      reward: { experience: 120, coins: 60 },
    },
  };

  // Get available quests for user
  static async getUserQuests(walletAddress) {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) return { daily: [], weekly: [] };

      const today = new Date().toDateString();
      const weekStart = this.getWeekStart();

      // Get user's quest progress
      const questProgress = user.questProgress || {};
      
      // Generate daily quests
      const dailyQuests = await this.generateDailyQuests(walletAddress, questProgress, today);
      
      // Generate weekly quests
      const weeklyQuests = await this.generateWeeklyQuests(walletAddress, questProgress, weekStart);

      return {
        daily: dailyQuests,
        weekly: weeklyQuests,
        updated: new Date(),
      };
    } catch (error) {
      console.error('Error fetching user quests:', error);
      return { daily: [], weekly: [] };
    }
  }

  // Check quest progress and award rewards
  static async checkQuestProgress(walletAddress, questId) {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) return null;

      const questProgress = user.questProgress || {};
      const quest = this.getQuestById(questId);
      
      if (!quest) {
        throw new Error('Quest not found');
      }

      const progress = await this.calculateQuestProgress(walletAddress, quest);
      
      // Update progress
      questProgress[questId] = {
        progress: progress.current,
        completed: progress.completed,
        completedAt: progress.completed ? new Date() : null,
        claimed: false,
      };

      user.questProgress = questProgress;
      await user.save();

      return {
        quest,
        progress: progress.current,
        completed: progress.completed,
        readyForReward: progress.completed && !questProgress[questId]?.claimed,
      };
    } catch (error) {
      console.error('Error checking quest progress:', error);
      throw new Error(`Failed to check quest progress: ${error.message}`);
    }
  }

  // Claim quest reward
  static async claimQuestReward(walletAddress, questId) {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) throw new Error('User not found');

      const questProgress = user.questProgress || {};
      const questData = questProgress[questId];

      if (!questData || !questData.completed) {
        throw new Error('Quest not completed');
      }

      if (questData.claimed) {
        throw new Error('Reward already claimed');
      }

      const quest = this.getQuestById(questId);
      if (!quest) throw new Error('Quest not found');

      // Award rewards
      const pets = await Pet.find({ owner: walletAddress });
      if (pets.length > 0) {
        const pet = pets[0]; // Award to first pet
        pet.experience += quest.reward.experience;
        await pet.save();
      }

      // Update user quest progress
      questProgress[questId].claimed = true;
      questProgress[questId].claimedAt = new Date();
      
      user.questProgress = questProgress;
      await user.save();

      return {
        success: true,
        reward: quest.reward,
        quest: quest.name,
      };
    } catch (error) {
      console.error('Error claiming quest reward:', error);
      throw new Error(`Failed to claim reward: ${error.message}`);
    }
  }

  // Generate daily quests
  static async generateDailyQuests(walletAddress, questProgress, today) {
    const dailyQuests = [];

    for (const [key, quest] of Object.entries(this.dailyQuests)) {
      const questData = questProgress[quest.id];
      
      // Skip if already completed today
      if (questData?.completedAt && 
          new Date(questData.completedAt).toDateString() === today) {
        continue;
      }

      const progress = await this.calculateQuestProgress(walletAddress, quest);
      
      dailyQuests.push({
        ...quest,
        progress: progress.current,
        completed: progress.completed,
        claimed: questData?.claimed || false,
      });
    }

    return dailyQuests;
  }

  // Generate weekly quests
  static async generateWeeklyQuests(walletAddress, questProgress, weekStart) {
    const weeklyQuests = [];

    for (const [key, quest] of Object.entries(this.weeklyQuests)) {
      const questData = questProgress[quest.id];
      
      // Skip if already completed this week
      if (questData?.completedAt && 
          new Date(questData.completedAt) >= weekStart) {
        continue;
      }

      const progress = await this.calculateQuestProgress(walletAddress, quest);
      
      weeklyQuests.push({
        ...quest,
        progress: progress.current,
        completed: progress.completed,
        claimed: questData?.claimed || false,
      });
    }

    return weeklyQuests;
  }

  // Calculate quest progress
  static async calculateQuestProgress(walletAddress, quest) {
    const pets = await Pet.find({ owner: walletAddress });
    const petIds = pets.map(pet => pet._id);

    let current = 0;
    let completed = false;

    switch (quest.objective.type) {
      case 'feed':
        const feedEvents = await GameEvent.countDocuments({
          petId: { $in: petIds },
          type: 'feed',
          timestamp: { $gte: this.getTodayStart() },
        });
        current = Math.min(feedEvents, quest.objective.count);
        completed = current >= quest.objective.count;
        break;

      case 'play':
        const playEvents = await GameEvent.countDocuments({
          petId: { $in: petIds },
          type: 'play',
          timestamp: { $gte: this.getTodayStart() },
        });
        current = Math.min(playEvents, quest.objective.count);
        completed = current >= quest.objective.count;
        break;

      case 'meditate':
        const meditateEvents = await GameEvent.countDocuments({
          petId: { $in: petIds },
          type: 'meditate',
          timestamp: { $gte: this.getTodayStart() },
        });
        current = Math.min(meditateEvents, quest.objective.count);
        completed = current >= quest.objective.count;
        break;

      case 'social':
        const socialEvents = await GameEvent.countDocuments({
          petId: { $in: petIds },
          type: 'social',
          timestamp: { $gte: this.getTodayStart() },
        });
        current = Math.min(socialEvents, quest.objective.count);
        completed = current >= quest.objective.count;
        break;

      case 'level_up':
        // This would require tracking level ups specifically
        current = 0;
        completed = false;
        break;

      case 'activity_variety':
        const activityTypes = await GameEvent.distinct('type', {
          petId: { $in: petIds },
          timestamp: { $gte: this.getWeekStart() },
        });
        current = Math.min(activityTypes.length, quest.objective.count);
        completed = current >= quest.objective.count;
        break;

      default:
        current = 0;
        completed = false;
    }

    return { current, completed };
  }

  // Helper methods
  static getQuestById(questId) {
    return Object.values(this.dailyQuests).find(q => q.id === questId) ||
           Object.values(this.weeklyQuests).find(q => q.id === questId);
  }

  static getTodayStart() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  static getWeekStart() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(today.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  }
}

module.exports = QuestService;