const LeaderboardService = require('../services/leaderboardService');

class LeaderboardController {
  // Get pet leaderboards
  static async getPetLeaderboards(req, res) {
    try {
      const { type = 'level', limit = 10 } = req.query;

      const leaderboard = await LeaderboardService.getPetLeaderboards(type, parseInt(limit));

      res.json({
        success: true,
        data: {
          leaderboard,
          type,
          limit: parseInt(limit),
          updated: new Date(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching leaderboard',
        error: error.message,
      });
    }
  }

  // Get user leaderboards
  static async getUserLeaderboards(req, res) {
    try {
      const { type = 'streak', limit = 10 } = req.query;

      const leaderboard = await LeaderboardService.getUserLeaderboards(type, parseInt(limit));

      res.json({
        success: true,
        data: {
          leaderboard,
          type,
          limit: parseInt(limit),
          updated: new Date(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user leaderboard',
        error: error.message,
      });
    }
  }

  // Get user's rank
  static async getUserRank(req, res) {
    try {
      const { walletAddress } = req.params;
      const { type = 'level' } = req.query;

      const rankInfo = await LeaderboardService.getUserRank(walletAddress, type);

      if (!rankInfo) {
        return res.status(404).json({
          success: false,
          message: 'User rank not found',
        });
      }

      res.json({
        success: true,
        data: rankInfo,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user rank',
        error: error.message,
      });
    }
  }

  // Get seasonal leaderboard
  static async getSeasonalLeaderboard(req, res) {
    try {
      const { seasonId } = req.params;
      const { type = 'level' } = req.query;

      const leaderboard = await LeaderboardService.getSeasonalLeaderboard(seasonId, type);

      res.json({
        success: true,
        data: {
          season: seasonId,
          leaderboard,
          type,
          updated: new Date(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching seasonal leaderboard',
        error: error.message,
      });
    }
  }

  // Get multiple leaderboards at once
  static async getCombinedLeaderboards(req, res) {
    try {
      const [levelLeaderboard, happinessLeaderboard, streakLeaderboard] = await Promise.all([
        LeaderboardService.getPetLeaderboards('level', 5),
        LeaderboardService.getPetLeaderboards('happiness', 5),
        LeaderboardService.getUserLeaderboards('streak', 5),
      ]);

      res.json({
        success: true,
        data: {
          level: levelLeaderboard,
          happiness: happinessLeaderboard,
          streak: streakLeaderboard,
          updated: new Date(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching combined leaderboards',
        error: error.message,
      });
    }
  }
}

module.exports = LeaderboardController;