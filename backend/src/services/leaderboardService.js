const Pet = require('../models/Pet');
const User = require('../models/User');
const GameEvent = require('../models/GameEvent');

class LeaderboardService {
  // Get top pets by various metrics
  static async getPetLeaderboards(type = 'level', limit = 10) {
    try {
      let pipeline = [];
      
      switch (type) {
        case 'level':
          pipeline = this.getLevelLeaderboardPipeline();
          break;
        case 'happiness':
          pipeline = this.getHappinessLeaderboardPipeline();
          break;
        case 'activity':
          pipeline = this.getActivityLeaderboardPipeline();
          break;
        case 'care':
          pipeline = this.getCareLeaderboardPipeline();
          break;
        default:
          pipeline = this.getLevelLeaderboardPipeline();
      }

      pipeline.push({ $limit: limit });

      const leaderboard = await Pet.aggregate(pipeline);
      return this.formatLeaderboardData(leaderboard, type);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  // Get user leaderboards
  static async getUserLeaderboards(type = 'streak', limit = 10) {
    try {
      let pipeline = [];
      
      switch (type) {
        case 'streak':
          pipeline = this.getStreakLeaderboardPipeline();
          break;
        case 'achievements':
          pipeline = this.getAchievementLeaderboardPipeline();
          break;
        case 'pets':
          pipeline = this.getPetCountLeaderboardPipeline();
          break;
        default:
          pipeline = this.getStreakLeaderboardPipeline();
      }

      pipeline.push({ $limit: limit });

      const leaderboard = await User.aggregate(pipeline);
      return this.formatUserLeaderboardData(leaderboard, type);
    } catch (error) {
      console.error('Error fetching user leaderboard:', error);
      return [];
    }
  }

  // Get user's position in leaderboard
  static async getUserRank(walletAddress, leaderboardType = 'level') {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) return null;

      let rank = 1;
      
      switch (leaderboardType) {
        case 'streak':
          rank = await User.countDocuments({
            streak: { $gt: user.streak },
          }) + 1;
          break;
          
        case 'achievements':
          rank = await User.countDocuments({
            $or: [
              { achievementPoints: { $gt: user.achievementPoints || 0 } },
              { 
                achievementPoints: user.achievementPoints || 0,
                _id: { $lt: user._id } 
              }
            ]
          }) + 1;
          break;
          
        default:
          // For pet-based leaderboards, get the highest pet rank
          const pets = await Pet.find({ owner: walletAddress });
          if (pets.length === 0) return null;
          
          const topPet = pets.reduce((max, pet) => 
            pet.level > max.level ? pet : max
          );
          
          rank = await Pet.countDocuments({
            level: { $gt: topPet.level },
          }) + 1;
      }

      return {
        rank,
        total: await this.getTotalParticipants(leaderboardType),
        score: this.getUserScore(user, leaderboardType),
      };
    } catch (error) {
      console.error('Error calculating user rank:', error);
      return null;
    }
  }

  // Get seasonal leaderboards
  static async getSeasonalLeaderboard(seasonId, type = 'level') {
    try {
      // Calculate season start and end dates
      const season = await this.getSeasonDates(seasonId);
      if (!season) return [];

      const pipeline = [
        {
          $match: {
            timestamp: {
              $gte: season.start,
              $lte: season.end,
            },
          },
        },
        {
          $group: {
            _id: '$petId',
            totalExperience: { $sum: '$experienceGained' },
            activityCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'pets',
            localField: '_id',
            foreignField: '_id',
            as: 'pet',
          },
        },
        {
          $unwind: '$pet',
        },
        {
          $project: {
            'pet.name': 1,
            'pet.species': 1,
            'pet.level': 1,
            'pet.owner': 1,
            totalExperience: 1,
            activityCount: 1,
            score: { $add: ['$totalExperience', { $multiply: ['$activityCount', 10] }] },
          },
        },
        {
          $sort: { score: -1 },
        },
        {
          $limit: 50,
        },
      ];

      const leaderboard = await GameEvent.aggregate(pipeline);
      return this.formatSeasonalLeaderboardData(leaderboard, seasonId);
    } catch (error) {
      console.error('Error fetching seasonal leaderboard:', error);
      return [];
    }
  }

  // Aggregation pipelines
  static getLevelLeaderboardPipeline() {
    return [
      {
        $sort: { level: -1, experience: -1 },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: 'walletAddress',
          as: 'ownerInfo',
        },
      },
      {
        $unwind: '$ownerInfo',
      },
      {
        $project: {
          name: 1,
          species: 1,
          level: 1,
          experience: 1,
          happiness: 1,
          'ownerInfo.username': 1,
          'ownerInfo.walletAddress': 1,
        },
      },
    ];
  }

  static getHappinessLeaderboardPipeline() {
    return [
      {
        $sort: { happiness: -1, level: -1 },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: 'walletAddress',
          as: 'ownerInfo',
        },
      },
      {
        $unwind: '$ownerInfo',
      },
      {
        $project: {
          name: 1,
          species: 1,
          happiness: 1,
          mood: 1,
          level: 1,
          'ownerInfo.username': 1,
        },
      },
    ];
  }

  static getActivityLeaderboardPipeline() {
    return [
      {
        $lookup: {
          from: 'gameevents',
          localField: '_id',
          foreignField: 'petId',
          as: 'events',
        },
      },
      {
        $addFields: {
          activityCount: { $size: '$events' },
          recentActivity: {
            $size: {
              $filter: {
                input: '$events',
                as: 'event',
                cond: {
                  $gte: [
                    '$$event.timestamp',
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  ],
                },
              },
            },
          },
        },
      },
      {
        $sort: { recentActivity: -1, activityCount: -1 },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: 'walletAddress',
          as: 'ownerInfo',
        },
      },
      {
        $unwind: '$ownerInfo',
      },
      {
        $project: {
          name: 1,
          species: 1,
          activityCount: 1,
          recentActivity: 1,
          level: 1,
          'ownerInfo.username': 1,
        },
      },
    ];
  }

  static getStreakLeaderboardPipeline() {
    return [
      {
        $match: { streak: { $gt: 0 } },
      },
      {
        $sort: { streak: -1, lastLogin: -1 },
      },
      {
        $project: {
          username: 1,
          walletAddress: 1,
          streak: 1,
          lastLogin: 1,
          achievementPoints: 1,
        },
      },
    ];
  }

  // Helper methods
  static formatLeaderboardData(data, type) {
    return data.map((item, index) => ({
      rank: index + 1,
      ...item,
      metric: this.getMetricValue(item, type),
    }));
  }

  static formatUserLeaderboardData(data, type) {
    return data.map((item, index) => ({
      rank: index + 1,
      ...item,
      metric: this.getUserMetricValue(item, type),
    }));
  }

  static formatSeasonalLeaderboardData(data, seasonId) {
    return data.map((item, index) => ({
      rank: index + 1,
      ...item,
      season: seasonId,
    }));
  }

  static getMetricValue(item, type) {
    const metrics = {
      level: item.level,
      happiness: item.happiness,
      activity: item.recentActivity || item.activityCount,
      care: item.happiness + item.energy + item.hunger,
    };
    return metrics[type] || item.level;
  }

  static getUserMetricValue(item, type) {
    const metrics = {
      streak: item.streak,
      achievements: item.achievementPoints || 0,
      pets: item.petCount,
    };
    return metrics[type] || item.streak;
  }

  static getUserScore(user, type) {
    const scores = {
      streak: user.streak,
      achievements: user.achievementPoints || 0,
      level: 0, // This would need to be calculated from pets
    };
    return scores[type] || 0;
  }

  static async getTotalParticipants(type) {
    if (type === 'streak' || type === 'achievements') {
      return await User.countDocuments({ streak: { $gt: 0 } });
    } else {
      return await Pet.countDocuments();
    }
  }

  static async getSeasonDates(seasonId) {
    // Simple season calculation - in production, this would come from a database
    const seasons = {
      'season-1': {
        start: new Date('2024-01-01'),
        end: new Date('2024-03-31'),
      },
      'season-2': {
        start: new Date('2024-04-01'),
        end: new Date('2024-06-30'),
      },
    };
    
    return seasons[seasonId] || null;
  }
}

module.exports = LeaderboardService;