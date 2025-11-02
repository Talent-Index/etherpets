const QuestService = require('../services/questService');

class QuestController {
  // Get user quests
  static async getUserQuests(req, res) {
    try {
      const walletAddress = req.user.walletAddress;

      const quests = await QuestService.getUserQuests(walletAddress);

      res.json({
        success: true,
        data: quests,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching quests',
        error: error.message,
      });
    }
  }

  // Check quest progress
  static async checkQuestProgress(req, res) {
    try {
      const { questId } = req.params;
      const walletAddress = req.user.walletAddress;

      const result = await QuestService.checkQuestProgress(walletAddress, questId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error checking quest progress',
        error: error.message,
      });
    }
  }

  // Claim quest reward
  static async claimQuestReward(req, res) {
    try {
      const { questId } = req.params;
      const walletAddress = req.user.walletAddress;

      const result = await QuestService.claimQuestReward(walletAddress, questId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error claiming quest reward',
        error: error.message,
      });
    }
  }

  // Refresh all quests progress
  static async refreshQuests(req, res) {
    try {
      const walletAddress = req.user.walletAddress;

      const quests = await QuestService.getUserQuests(walletAddress);
      let updatedCount = 0;

      // Check progress for all quests
      for (const quest of [...quests.daily, ...quests.weekly]) {
        if (!quest.completed && !quest.claimed) {
          await QuestService.checkQuestProgress(walletAddress, quest.id);
          updatedCount++;
        }
      }

      // Get updated quests
      const updatedQuests = await QuestService.getUserQuests(walletAddress);

      res.json({
        success: true,
        data: {
          quests: updatedQuests,
          updated: updatedCount,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error refreshing quests',
        error: error.message,
      });
    }
  }
}

module.exports = QuestController;