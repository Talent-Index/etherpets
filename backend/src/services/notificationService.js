const GameEvent = require('../models/GameEvent');
const Pet = require('../models/Pet');

class NotificationService {
  // Generate notifications for pet owners
  static async generateNotifications(petId, eventType, data = {}) {
    try {
      const pet = await Pet.findById(petId).populate('owner');
      if (!pet) return;

      const notifications = {
        low_hunger: {
          title: `${pet.name} is hungry!`,
          message: `Your pet's hunger is getting low. Consider feeding ${pet.name} soon.`,
          type: 'warning',
          priority: 'high',
        },
        low_energy: {
          title: `${pet.name} needs rest`,
          message: `Your pet is feeling tired. Some rest would help ${pet.name} recover.`,
          type: 'info',
          priority: 'medium',
        },
        low_happiness: {
          title: `${pet.name} seems sad`,
          message: `Your pet could use some attention and playtime.`,
          type: 'warning',
          priority: 'medium',
        },
        level_up: {
          title: `Level Up! 🎉`,
          message: `${pet.name} has reached level ${data.newLevel}!`,
          type: 'success',
          priority: 'low',
        },
        evolution_ready: {
          title: `Evolution Available! ✨`,
          message: `${pet.name} is ready to evolve! Continue your care to see the transformation.`,
          type: 'success',
          priority: 'high',
        },
        streak_milestone: {
          title: `Streak Milestone! 🔥`,
          message: `You've maintained a ${data.streak} day care streak!`,
          type: 'info',
          priority: 'low',
        },
      };

      return notifications[eventType] || null;
    } catch (error) {
      console.error('Error generating notifications:', error);
      return null;
    }
  }

  // Check for pending notifications for a user
  static async checkUserNotifications(walletAddress) {
    try {
      const pets = await Pet.find({ owner: walletAddress });
      const notifications = [];

      for (const pet of pets) {
        // Check for low stats
        if (pet.hunger < 30) {
          const notification = await this.generateNotifications(pet._id, 'low_hunger');
          if (notification) notifications.push(notification);
        }

        if (pet.energy < 20) {
          const notification = await this.generateNotifications(pet._id, 'low_energy');
          if (notification) notifications.push(notification);
        }

        if (pet.happiness < 30) {
          const notification = await this.generateNotifications(pet._id, 'low_happiness');
          if (notification) notifications.push(notification);
        }

        // Check for recent level ups (within last hour)
        const recentLevelUp = await GameEvent.findOne({
          petId: pet._id,
          type: 'level_up',
          timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
        });

        if (recentLevelUp) {
          const notification = await this.generateNotifications(pet._id, 'level_up', {
            newLevel: pet.level,
          });
          if (notification) notifications.push(notification);
        }
      }

      return notifications.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      console.error('Error checking user notifications:', error);
      return [];
    }
  }

  // Create notification event
  static async createNotificationEvent(petId, type, data = {}) {
    try {
      const notification = await this.generateNotifications(petId, type, data);
      if (!notification) return null;

      const event = new GameEvent({
        petId,
        type: 'notification',
        description: notification.message,
        metadata: {
          notificationType: type,
          ...data,
        },
      });

      await event.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification event:', error);
      return null;
    }
  }
}

module.exports = NotificationService;