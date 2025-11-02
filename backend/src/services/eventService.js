const GameEvent = require('../models/GameEvent');
const Pet = require('../models/Pet');
const User = require('../models/User');
const SocketService = require('./socketService');

class EventService {
  // Log game event with comprehensive tracking
  static async logEvent(eventData) {
    try {
      const event = new GameEvent({
        ...eventData,
        timestamp: new Date(),
      });

      await event.save();

      // Emit real-time update if socket service is available
      if (global.socketService) {
        global.socketService.broadcastPetUpdate(eventData.petId, {
          type: 'event',
          event: eventData.type,
          changes: {
            energy: eventData.energyChange,
            hunger: eventData.hungerChange,
            happiness: eventData.happinessChange,
          },
        });
      }

      // Check for achievement triggers
      await this.checkAchievementTriggers(event);

      // Update pet statistics
      await this.updatePetStats(event);

      return event;
    } catch (error) {
      console.error('Error logging event:', error);
      throw new Error(`Failed to log event: ${error.message}`);
    }
  }

  // Batch log multiple events
  static async logBatchEvents(events) {
    try {
      const eventsWithTimestamp = events.map(event => ({
        ...event,
        timestamp: new Date(),
      }));

      const result = await GameEvent.insertMany(eventsWithTimestamp);
      
      // Process each event for achievements and stats
      for (const event of events) {
        await this.checkAchievementTriggers(event);
        await this.updatePetStats(event);
      }

      return result;
    } catch (error) {
      console.error('Error logging batch events:', error);
      throw new Error(`Failed to log batch events: ${error.message}`);
    }
  }

  // Get event statistics
  static async getEventStats(timeRange = '24h') {
    try {
      const timeFilter = this.getTimeFilter(timeRange);
      
      const stats = await GameEvent.aggregate([
        {
          $match: {
            timestamp: timeFilter,
          },
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalExperience: { $sum: '$experienceGained' },
            avgHappinessChange: { $avg: '$happinessChange' },
            avgEnergyChange: { $avg: '$energyChange' },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      const totalEvents = await GameEvent.countDocuments({ timestamp: timeFilter });
      const uniqueUsers = await GameEvent.distinct('petId', { timestamp: timeFilter })
        .then(petIds => Pet.distinct('owner', { _id: { $in: petIds } }));

      return {
        timeRange,
        totalEvents,
        uniqueUsers: uniqueUsers.length,
        byType: stats,
        timeframe: {
          start: timeFilter.$gte,
          end: new Date(),
        },
      };
    } catch (error) {
      console.error('Error fetching event stats:', error);
      throw new Error(`Failed to get event stats: ${error.message}`);
    }
  }

  // Get user event history
  static async getUserEventHistory(walletAddress, filters = {}) {
    try {
      const {
        type,
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = filters;

      // Get user's pets
      const pets = await Pet.find({ owner: walletAddress });
      const petIds = pets.map(pet => pet._id);

      const query = { petId: { $in: petIds } };

      if (type) {
        query.type = type;
      }

      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      const skip = (page - 1) * limit;

      const [events, total] = await Promise.all([
        GameEvent.find(query)
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate('petId', 'name species')
          .lean(),
        GameEvent.countDocuments(query),
      ]);

      // Calculate summary statistics
      const summary = await this.calculateEventSummary(petIds, query);

      return {
        events,
        summary,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching user event history:', error);
      throw new Error(`Failed to get user event history: ${error.message}`);
    }
  }

  // Clean up old events
  static async cleanupOldEvents(retentionDays = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const result = await GameEvent.deleteMany({
        timestamp: { $lt: cutoffDate },
      });

      return {
        deleted: result.deletedCount,
        cutoffDate,
        retentionDays,
      };
    } catch (error) {
      console.error('Error cleaning up old events:', error);
      throw new Error(`Failed to cleanup events: ${error.message}`);
    }
  }

  // Helper methods
  static getTimeFilter(timeRange) {
    const now = new Date();
    const filter = { $gte: now };

    switch (timeRange) {
      case '1h':
        filter.$gte.setHours(now.getHours() - 1);
        break;
      case '24h':
        filter.$gte.setDate(now.getDate() - 1);
        break;
      case '7d':
        filter.$gte.setDate(now.getDate() - 7);
        break;
      case '30d':
        filter.$gte.setDate(now.getDate() - 30);
        break;
      default:
        filter.$gte.setDate(now.getDate() - 1); // Default to 24h
    }

    return filter;
  }

  static async checkAchievementTriggers(event) {
    // This would integrate with the achievement system
    // For now, it's a placeholder
  }

  static async updatePetStats(event) {
    // Update pet's total play time and other statistics
    if (event.petId) {
      await Pet.findByIdAndUpdate(event.petId, {
        $inc: { totalPlayTime: 1 }, // Increment by 1 minute (or appropriate unit)
        $set: { lastActivity: new Date() },
      });
    }
  }

  static async calculateEventSummary(petIds, query) {
    const summary = await GameEvent.aggregate([
      {
        $match: {
          ...query,
          petId: { $in: petIds },
        },
      },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          totalExperience: { $sum: '$experienceGained' },
          avgHappinessChange: { $avg: '$happinessChange' },
          favoriteActivity: {
            $max: {
              $cond: [
                { $gt: ['$count', 0] },
                { type: '$type', count: '$count' },
                null,
              ],
            },
          },
        },
      },
    ]);

    return summary[0] || {
      totalEvents: 0,
      totalExperience: 0,
      avgHappinessChange: 0,
      favoriteActivity: null,
    };
  }
}

module.exports = EventService;