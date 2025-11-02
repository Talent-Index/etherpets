const Pet = require('../models/Pet');
const User = require('../models/User');
const GameEvent = require('../models/GameEvent');

class RewardService {
  // Award experience to pet
  static async awardExperience(petId, experience, source = 'activity') {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) {
        throw new Error('Pet not found');
      }

      const levelResult = pet.addExperience(experience);
      await pet.save();

      // Log the experience gain
      await GameEvent.create({
        petId,
        type: 'experience',
        description: `Gained ${experience} experience from ${source}`,
        experienceGained: experience,
        metadata: { source },
      });

      return {
        success: true,
        experience,
        leveledUp: levelResult.leveledUp,
        newLevel: levelResult.newLevel,
        totalExperience: pet.experience,
      };
    } catch (error) {
      console.error('Error awarding experience:', error);
      throw new Error(`Failed to award experience: ${error.message}`);
    }
  }

  // Award coins to user
  static async awardCoins(walletAddress, coins, source = 'quest') {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) {
        throw new Error('User not found');
      }

      // Update user's coin balance
      user.coins = (user.coins || 0) + coins;
      await user.save();

      // Log the coin reward (you might want a separate collection for currency transactions)
      console.log(`Awarded ${coins} coins to ${walletAddress} from ${source}`);

      return {
        success: true,
        coins,
        newBalance: user.coins,
        source,
      };
    } catch (error) {
      console.error('Error awarding coins:', error);
      throw new Error(`Failed to award coins: ${error.message}`);
    }
  }

  // Award item to user
  static async awardItem(walletAddress, itemId, quantity = 1, source = 'achievement') {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) {
        throw new Error('User not found');
      }

      // Update user's inventory
      // This would interact with an inventory system
      // For now, we'll log the award
      console.log(`Awarded ${quantity} x ${itemId} to ${walletAddress} from ${source}`);

      return {
        success: true,
        itemId,
        quantity,
        source,
      };
    } catch (error) {
      console.error('Error awarding item:', error);
      throw new Error(`Failed to award item: ${error.message}`);
    }
  }

  // Process quest rewards
  static async processQuestRewards(walletAddress, questId, rewards) {
    try {
      const results = [];

      // Award each type of reward
      for (const reward of rewards) {
        switch (reward.type) {
          case 'experience':
            // Award experience to user's active pet
            const pets = await Pet.find({ owner: walletAddress });
            if (pets.length > 0) {
              const result = await this.awardExperience(pets[0]._id, reward.value, `quest_${questId}`);
              results.push(result);
            }
            break;

          case 'coins':
            const coinResult = await this.awardCoins(walletAddress, reward.value, `quest_${questId}`);
            results.push(coinResult);
            break;

          case 'item':
            const itemResult = await this.awardItem(walletAddress, reward.itemId, reward.value, `quest_${questId}`);
            results.push(itemResult);
            break;

          default:
            console.warn(`Unknown reward type: ${reward.type}`);
        }
      }

      return {
        success: true,
        rewards: results,
        questId,
      };
    } catch (error) {
      console.error('Error processing quest rewards:', error);
      throw new Error(`Failed to process quest rewards: ${error.message}`);
    }
  }

  // Process achievement rewards
  static async processAchievementRewards(walletAddress, achievementId, points) {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) {
        throw new Error('User not found');
      }

      // Award achievement points
      user.achievementPoints = (user.achievementPoints || 0) + points;
      await user.save();

      // Award bonus coins for achievements
      const bonusCoins = Math.floor(points / 10); // 1 coin per 10 achievement points
      if (bonusCoins > 0) {
        await this.awardCoins(walletAddress, bonusCoins, `achievement_${achievementId}`);
      }

      return {
        success: true,
        achievementPoints: points,
        bonusCoins,
        newAchievementPoints: user.achievementPoints,
      };
    } catch (error) {
      console.error('Error processing achievement rewards:', error);
      throw new Error(`Failed to process achievement rewards: ${error.message}`);
    }
  }

  // Calculate level-up rewards
  static calculateLevelUpRewards(oldLevel, newLevel) {
    const rewards = [];

    // Award coins for leveling up
    const coinReward = newLevel * 10;
    rewards.push({
      type: 'coins',
      value: coinReward,
      description: `Level ${newLevel} reward`,
    });

    // Special rewards at milestone levels
    if (newLevel % 10 === 0) {
      rewards.push({
        type: 'item',
        itemId: `milestone_${newLevel}`,
        value: 1,
        description: `Milestone level ${newLevel} reward`,
      });
    }

    return rewards;
  }

  // Distribute seasonal rewards
  static async distributeSeasonalRewards(seasonId, leaderboard) {
    try {
      const distribution = [];

      for (const [walletAddress, entry] of leaderboard.entries()) {
        const rewards = this.calculateSeasonalRewards(entry.rank);
        
        for (const reward of rewards) {
          await this.processSeasonalReward(walletAddress, reward, seasonId);
        }

        distribution.push({
          walletAddress,
          rank: entry.rank,
          rewards,
        });
      }

      return {
        success: true,
        distribution,
        seasonId,
        totalParticipants: leaderboard.size,
      };
    } catch (error) {
      console.error('Error distributing seasonal rewards:', error);
      throw new Error(`Failed to distribute seasonal rewards: ${error.message}`);
    }
  }

  // Helper methods
  static calculateSeasonalRewards(rank) {
    const rewards = [];

    // Top ranks get special rewards
    if (rank <= 10) {
      rewards.push({
        type: 'coins',
        value: (11 - rank) * 100, // 1000 for 1st, 900 for 2nd, etc.
        description: `Season rank ${rank} reward`,
      });

      if (rank === 1) {
        rewards.push({
          type: 'item',
          itemId: 'champion_trophy',
          value: 1,
          description: 'Season Champion Trophy',
        });
      }
    }

    // Participation reward for everyone
    rewards.push({
      type: 'coins',
      value: 50,
      description: 'Season participation reward',
    });

    return rewards;
  }

  static async processSeasonalReward(walletAddress, reward, seasonId) {
    switch (reward.type) {
      case 'coins':
        return await this.awardCoins(walletAddress, reward.value, `season_${seasonId}`);
      case 'item':
        return await this.awardItem(walletAddress, reward.itemId, reward.value, `season_${seasonId}`);
      default:
        console.warn(`Unknown seasonal reward type: ${reward.type}`);
    }
  }
}

module.exports = RewardService;