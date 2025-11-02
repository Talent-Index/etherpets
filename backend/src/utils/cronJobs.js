const cron = require('node-cron');
const PetDecayService = require('../services/petDecayService');
const NotificationService = require('../services/notificationService');
const Pet = require('../models/Pet');

class CronJobs {
  static init() {
    // Run every hour to check pet decay
    cron.schedule('0 * * * *', async () => {
      try {
        console.log('Running hourly pet decay check...');
        await PetDecayService.applyGlobalDecay();
      } catch (error) {
        console.error('Error in hourly decay check:', error);
      }
    });

    // Run every day at midnight to reset daily limits and check streaks
    cron.schedule('0 0 * * *', async () => {
      try {
        console.log('Running daily maintenance...');
        await this.dailyMaintenance();
      } catch (error) {
        console.error('Error in daily maintenance:', error);
      }
    });

    // Run every 6 hours to check for notifications
    cron.schedule('0 */6 * * *', async () => {
      try {
        console.log('Running notification check...');
        await this.checkAllNotifications();
      } catch (error) {
        console.error('Error in notification check:', error);
      }
    });

    console.log('Cron jobs initialized');
  }

  static async dailyMaintenance() {
    try {
      // Reset daily limits if any
      // Update streaks for users who logged in today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const usersToUpdate = await User.find({
        lastLogin: { $gte: today },
      });

      for (const user of usersToUpdate) {
        user.streak += 1;
        await user.save();
      }

      console.log(`Updated streaks for ${usersToUpdate.length} users`);
    } catch (error) {
      console.error('Error in daily maintenance:', error);
    }
  }

  static async checkAllNotifications() {
    try {
      const neglectedPets = await Pet.find({
        $or: [
          { hunger: { $lt: 20 } },
          { energy: { $lt: 15 } },
          { happiness: { $lt: 25 } },
        ],
      });

      for (const pet of neglectedPets) {
        if (pet.hunger < 20) {
          await NotificationService.createNotificationEvent(pet._id, 'low_hunger');
        }
        if (pet.energy < 15) {
          await NotificationService.createNotificationEvent(pet._id, 'low_energy');
        }
        if (pet.happiness < 25) {
          await NotificationService.createNotificationEvent(pet._id, 'low_happiness');
        }
      }

      console.log(`Checked notifications for ${neglectedPets.length} pets`);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }
}

module.exports = CronJobs;