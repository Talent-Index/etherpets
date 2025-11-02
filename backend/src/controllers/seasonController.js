const Season = require('../models/Season');
const LeaderboardService = require('../services/leaderboardService');

class SeasonController {
  // Get current active season
  static async getCurrentSeason(req, res) {
    try {
      const season = await Season.findOne({ active: true });
      
      if (!season) {
        return res.status(404).json({
          success: false,
          message: 'No active season found',
        });
      }

      res.json({
        success: true,
        data: season,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching current season',
        error: error.message,
      });
    }
  }

  // Get season leaderboard
  static async getSeasonLeaderboard(req, res) {
    try {
      const { seasonId } = req.params;
      const { limit = 100 } = req.query;

      const season = await Season.findOne({ seasonId });
      if (!season) {
        return res.status(404).json({
          success: false,
          message: 'Season not found',
        });
      }

      // Convert leaderboard Map to sorted array
      const leaderboard = Array.from(season.leaderboard.values())
        .sort((a, b) => a.rank - b.rank)
        .slice(0, parseInt(limit));

      res.json({
        success: true,
        data: {
          season: season.name,
          leaderboard,
          totalParticipants: season.leaderboard.size,
          updated: season.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching season leaderboard',
        error: error.message,
      });
    }
  }

  // Get user's season progress
  static async getUserSeasonProgress(req, res) {
    try {
      const { seasonId } = req.params;
      const walletAddress = req.user.walletAddress;

      const season = await Season.findOne({ seasonId });
      if (!season) {
        return res.status(404).json({
          success: false,
          message: 'Season not found',
        });
      }

      const userEntry = season.leaderboard.get(walletAddress);
      const seasonalStats = await this.getUserSeasonalStats(walletAddress, season);

      res.json({
        success: true,
        data: {
          season: season.name,
          userRank: userEntry?.rank || null,
          userScore: userEntry?.score || 0,
          rewardsClaimed: userEntry?.rewardsClaimed || false,
          stats: seasonalStats,
          seasonEnd: season.endDate,
          daysRemaining: Math.ceil((season.endDate - new Date()) / (1000 * 60 * 60 * 24)),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user season progress',
        error: error.message,
      });
    }
  }

  // Claim season rewards
  static async claimSeasonRewards(req, res) {
    try {
      const { seasonId } = req.params;
      const walletAddress = req.user.walletAddress;

      const season = await Season.findOne({ seasonId, completed: true });
      if (!season) {
        return res.status(404).json({
          success: false,
          message: 'Season not found or not completed',
        });
      }

      const userEntry = season.leaderboard.get(walletAddress);
      if (!userEntry) {
        return res.status(404).json({
          success: false,
          message: 'No season participation found',
        });
      }

      if (userEntry.rewardsClaimed) {
        return res.status(400).json({
          success: false,
          message: 'Rewards already claimed',
        });
      }

      // Calculate rewards based on rank
      const rewards = this.calculateRewards(userEntry.rank, season.rewards);
      
      // Update user entry
      userEntry.rewardsClaimed = true;
      season.leaderboard.set(walletAddress, userEntry);
      await season.save();

      // TODO: Actually award the rewards to user

      res.json({
        success: true,
        data: {
          rewards,
          rank: userEntry.rank,
          season: season.name,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error claiming season rewards',
        error: error.message,
      });
    }
  }

  // Get all seasons
  static async getAllSeasons(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const [seasons, total] = await Promise.all([
        Season.find()
          .sort({ startDate: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .select('-leaderboard')
          .lean(),
        Season.countDocuments(),
      ]);

      res.json({
        success: true,
        data: {
          seasons,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching seasons',
        error: error.message,
      });
    }
  }

  // Helper methods
  static async getUserSeasonalStats(walletAddress, season) {
    // This would calculate user's activity during the season
    return {
      petsLeveled: 0,
      activitiesCompleted: 0,
      questsFinished: 0,
      totalExperience: 0,
    };
  }

  static calculateRewards(rank, rewardStructure) {
    const topReward = rewardStructure.topPlayers.find(r => r.rank === rank);
    if (topReward) {
      return [topReward.reward];
    }

    // Participation reward for everyone else
    return [rewardStructure.participation];
  }
}

module.exports = SeasonController;