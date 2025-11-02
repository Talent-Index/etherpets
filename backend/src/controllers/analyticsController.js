const Pet = require('../models/Pet');
const User = require('../models/User');
const GameEvent = require('../models/GameEvent');

class AnalyticsController {
  // Get overall game statistics
  static async getGameStats(req, res) {
    try {
      const [
        totalUsers,
        totalPets,
        activeToday,
        totalEvents,
        popularSpecies,
        averageLevel,
      ] = await Promise.all([
        User.countDocuments(),
        Pet.countDocuments(),
        User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
        GameEvent.countDocuments(),
        Pet.aggregate([
          { $group: { _id: '$species', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),
        Pet.aggregate([
          { $group: { _id: null, avgLevel: { $avg: '$level' } } },
        ]),
      ]);

      const eventTypes = await GameEvent.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      res.json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            activeToday,
          },
          pets: {
            total: totalPets,
            averageLevel: averageLevel[0]?.avgLevel || 1,
          },
          activity: {
            totalEvents,
            eventTypes,
          },
          popularSpecies,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching game statistics',
        error: error.message,
      });
    }
  }

  // Get user analytics
  static async getUserAnalytics(req, res) {
    try {
      const { userId } = req.params;

      const [
        user,
        pets,
        recentEvents,
        activityByDay,
        favoriteActions,
      ] = await Promise.all([
        User.findById(userId),
        Pet.find({ owner: userId }),
        GameEvent.find({ petId: { $in: pets.map(p => p._id) } })
          .sort({ timestamp: -1 })
          .limit(100),
        GameEvent.aggregate([
          { $match: { petId: { $in: pets.map(p => p._id) } } },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: -1 } },
          { $limit: 30 },
        ]),
        GameEvent.aggregate([
          { $match: { petId: { $in: pets.map(p => p._id) } } },
          { $group: { _id: '$type', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),
      ]);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Calculate playtime (estimated)
      const totalPlayTime = pets.reduce((total, pet) => total + (pet.totalPlayTime || 0), 0);

      // Calculate engagement score
      const engagementScore = this.calculateEngagementScore(recentEvents);

      res.json({
        success: true,
        data: {
          user: {
            username: user.username,
            streak: user.streak,
            joined: user.createdAt,
          },
          pets: {
            total: pets.length,
            species: pets.reduce((acc, pet) => {
              acc[pet.species] = (acc[pet.species] || 0) + 1;
              return acc;
            }, {}),
            totalLevel: pets.reduce((sum, pet) => sum + pet.level, 0),
          },
          activity: {
            totalPlayTime,
            engagementScore,
            activityByDay,
            favoriteActions,
            recentEvents: recentEvents.slice(0, 10),
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user analytics',
        error: error.message,
      });
    }
  }

  // Get pet analytics
  static async getPetAnalytics(req, res) {
    try {
      const { petId } = req.params;

      const [pet, events, moodHistory, growthTimeline] = await Promise.all([
        Pet.findById(petId),
        GameEvent.find({ petId }).sort({ timestamp: -1 }),
        GameEvent.aggregate([
          { $match: { petId: petId } },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
              },
              avgHappiness: { $avg: '$happinessChange' },
              mood: { $last: '$metadata.mood' },
            },
          },
          { $sort: { _id: 1 } },
          { $limit: 14 },
        ]),
        GameEvent.aggregate([
          { $match: { petId: petId, experienceGained: { $gt: 0 } } },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
              },
              experience: { $sum: '$experienceGained' },
              levelUps: {
                $sum: {
                  $cond: [{ $gt: ['$experienceGained', 10] }, 1, 0],
                },
              },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

      if (!pet) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found',
        });
      }

      // Calculate activity patterns
      const activityPatterns = this.calculateActivityPatterns(events);
      
      // Calculate care consistency
      const careConsistency = this.calculateCareConsistency(events);

      res.json({
        success: true,
        data: {
          pet: {
            name: pet.name,
            species: pet.species,
            level: pet.level,
            createdAt: pet.birthDate,
          },
          stats: {
            totalEvents: events.length,
            favoriteActivities: this.getFavoriteActivities(events),
            moodHistory,
            growthTimeline,
          },
          patterns: activityPatterns,
          consistency: careConsistency,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching pet analytics',
        error: error.message,
      });
    }
  }

  // Helper methods
  static calculateEngagementScore(events) {
    if (events.length === 0) return 0;
    
    const recentEvents = events.filter(event => 
      new Date(event.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    
    const score = Math.min(100, (recentEvents.length / 20) * 100);
    return Math.round(score);
  }

  static calculateActivityPatterns(events) {
    const patterns = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };

    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      if (hour >= 5 && hour < 12) patterns.morning++;
      else if (hour >= 12 && hour < 17) patterns.afternoon++;
      else if (hour >= 17 && hour < 22) patterns.evening++;
      else patterns.night++;
    });

    return patterns;
  }

  static calculateCareConsistency(events) {
    if (events.length < 2) return 0;
    
    const dates = events.map(e => new Date(e.timestamp).toDateString());
    const uniqueDays = new Set(dates).size;
    const totalDays = (new Date() - new Date(events[events.length - 1].timestamp)) / (1000 * 60 * 60 * 24);
    
    return Math.round((uniqueDays / Math.max(1, totalDays)) * 100);
  }

  static getFavoriteActivities(events) {
    const activityCount = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(activityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, count]) => ({ type, count }));
  }
}

module.exports = AnalyticsController;