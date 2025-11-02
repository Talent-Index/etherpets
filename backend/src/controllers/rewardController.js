const RewardService = require('../services/rewardService');

class RewardController {
  // Award experience to pet
  static async awardExperience(req, res) {
    try {
      const { petId } = req.params;
      const { experience, source = 'manual' } = req.body;

      const result = await RewardService.awardExperience(petId, experience, source);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error awarding experience',
        error: error.message,
      });
    }
  }

  // Award coins to user
  static async awardCoins(req, res) {
    try {
      const { walletAddress } = req.params;
      const { coins, source = 'manual' } = req.body;

      const result = await RewardService.awardCoins(walletAddress, coins, source);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error awarding coins',
        error: error.message,
      });
    }
  }

  // Process level-up rewards
  static async processLevelUp(req, res) {
    try {
      const { petId } = req.params;
      const { oldLevel, newLevel } = req.body;

      const rewards = RewardService.calculateLevelUpRewards(oldLevel, newLevel);
      
      // Get pet owner
      const pet = await require('../models/Pet').findById(petId);
      if (!pet) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found',
        });
      }

      // Award rewards
      const results = [];
      for (const reward of rewards) {
        if (reward.type === 'coins') {
          const result = await RewardService.awardCoins(pet.owner, reward.value, `level_${newLevel}`);
          results.push(result);
        }
      }

      res.json({
        success: true,
        data: {
          level: newLevel,
          rewards: results,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error processing level-up rewards',
        error: error.message,
      });
    }
  }

  // Claim daily login reward
  static async claimDailyReward(req, res) {
    try {
      const walletAddress = req.user.walletAddress;

      // Check if user already claimed today
      const today = new Date().toDateString();
      const user = await require('../models/User').findOne({ walletAddress });
      
      if (user.lastDailyReward && new Date(user.lastDailyReward).toDateString() === today) {
        return res.status(400).json({
          success: false,
          message: 'Daily reward already claimed today',
        });
      }

      // Calculate streak bonus
      const streak = user.streak || 1;
      const baseReward = 50;
      const streakBonus = Math.min(streak * 5, 100); // Max 100 bonus coins
      const totalReward = baseReward + streakBonus;

      // Award coins
      const result = await RewardService.awardCoins(walletAddress, totalReward, 'daily_login');

      // Update last reward claim
      user.lastDailyReward = new Date();
      await user.save();

      res.json({
        success: true,
        data: {
          ...result,
          streak,
          streakBonus,
          baseReward,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error claiming daily reward',
        error: error.message,
      });
    }
  }
}

module.exports = RewardController;