const User = require('../models/User');
const Pet = require('../models/Pet');
const GameEvent = require('../models/GameEvent');
const BackupManager = require('../utils/backupManager');
const DataMigration = require('../utils/dataMigration');

class AdminService {
  // Get system statistics
  static async getSystemStats() {
    try {
      const [
        totalUsers,
        totalPets,
        totalEvents,
        activeToday,
        newUsersToday,
        systemLoad,
        databaseSize,
      ] = await Promise.all([
        User.countDocuments(),
        Pet.countDocuments(),
        GameEvent.countDocuments(),
        User.countDocuments({
          lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        }),
        User.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        }),
        this.getSystemLoad(),
        this.getDatabaseSize(),
      ]);

      return {
        users: {
          total: totalUsers,
          activeToday,
          newToday: newUsersToday,
        },
        pets: {
          total: totalPets,
          averageLevel: await this.getAveragePetLevel(),
        },
        activity: {
          totalEvents,
          eventsToday: await this.getEventsToday(),
        },
        system: {
          load: systemLoad,
          databaseSize,
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
        },
        updated: new Date(),
      };
    } catch (error) {
      console.error('Error fetching system stats:', error);
      throw new Error(`Failed to get system stats: ${error.message}`);
    }
  }

  // Get user management data
  static async getUserManagementData(page = 1, limit = 20, search = '') {
    try {
      const query = search ? {
        $or: [
          { walletAddress: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
        ],
      } : {};

      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('-__v')
          .lean(),
        User.countDocuments(query),
      ]);

      // Enrich with pet data
      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          const pets = await Pet.find({ owner: user.walletAddress });
          return {
            ...user,
            petCount: pets.length,
            totalPlayTime: pets.reduce((sum, pet) => sum + (pet.totalPlayTime || 0), 0),
            lastPetActivity: await this.getLastPetActivity(user.walletAddress),
          };
        })
      );

      return {
        users: enrichedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching user management data:', error);
      throw new Error(`Failed to get user data: ${error.message}`);
    }
  }

  // Get pet management data
  static async getPetManagementData(page = 1, limit = 20, filters = {}) {
    try {
      const query = {};
      
      if (filters.species) {
        query.species = filters.species;
      }
      if (filters.minLevel) {
        query.level = { ...query.level, $gte: parseInt(filters.minLevel) };
      }
      if (filters.maxLevel) {
        query.level = { ...query.level, $lte: parseInt(filters.maxLevel) };
      }
      if (filters.owner) {
        query.owner = { $regex: filters.owner, $options: 'i' };
      }

      const skip = (page - 1) * limit;

      const [pets, total] = await Promise.all([
        Pet.find(query)
          .sort({ level: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('owner', 'username walletAddress')
          .lean(),
        Pet.countDocuments(query),
      ]);

      return {
        pets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching pet management data:', error);
      throw new Error(`Failed to get pet data: ${error.message}`);
    }
  }

  // Update user data (admin override)
  static async updateUserData(walletAddress, updates) {
    try {
      const allowedUpdates = [
        'username',
        'streak',
        'achievementPoints',
        'preferences',
        'isActive',
      ];

      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key];
          return obj;
        }, {});

      if (Object.keys(filteredUpdates).length === 0) {
        throw new Error('No valid fields to update');
      }

      const user = await User.findOneAndUpdate(
        { walletAddress },
        { $set: filteredUpdates },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        user: {
          walletAddress: user.walletAddress,
          username: user.username,
          streak: user.streak,
          achievementPoints: user.achievementPoints,
          isActive: user.isActive,
        },
      };
    } catch (error) {
      console.error('Error updating user data:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Update pet data (admin override)
  static async updatePetData(petId, updates) {
    try {
      const allowedUpdates = [
        'name',
        'level',
        'experience',
        'happiness',
        'energy',
        'hunger',
        'mood',
        'hiddenTraits',
      ];

      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key];
          return obj;
        }, {});

      if (Object.keys(filteredUpdates).length === 0) {
        throw new Error('No valid fields to update');
      }

      const pet = await Pet.findByIdAndUpdate(
        petId,
        { $set: filteredUpdates },
        { new: true, runValidators: true }
      ).populate('owner', 'username walletAddress');

      if (!pet) {
        throw new Error('Pet not found');
      }

      return {
        success: true,
        pet: {
          id: pet._id,
          name: pet.name,
          species: pet.species,
          level: pet.level,
          happiness: pet.happiness,
          energy: pet.energy,
          hunger: pet.hunger,
          owner: pet.owner,
        },
      };
    } catch (error) {
      console.error('Error updating pet data:', error);
      throw new Error(`Failed to update pet: ${error.message}`);
    }
  }

  // Run system maintenance
  static async runSystemMaintenance() {
    try {
      const results = {};

      // Clean up orphaned data
      results.orphanedEvents = await this.cleanupOrphanedEvents();
      
      // Recalculate statistics
      results.statsRecalculation = await this.recalculateAllStats();
      
      // Run data migrations
      results.migrations = await DataMigration.runAllMigrations();
      
      // Create backup
      results.backup = await BackupManager.createBackup();

      // Clean up old backups
      results.backupCleanup = await BackupManager.cleanupOldBackups();

      return {
        success: true,
        results,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error running system maintenance:', error);
      throw new Error(`Maintenance failed: ${error.message}`);
    }
  }

  // Get system logs (simplified)
  static async getSystemLogs(limit = 100) {
    try {
      // In a real implementation, this would query a proper logging system
      const recentEvents = await GameEvent.find()
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('petId', 'name species')
        .lean();

      return recentEvents.map(event => ({
        timestamp: event.timestamp,
        type: event.type,
        description: event.description,
        pet: event.petId ? {
          name: event.petId.name,
          species: event.petId.species,
        } : null,
        changes: {
          energy: event.energyChange,
          hunger: event.hungerChange,
          happiness: event.happinessChange,
        },
      }));
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw new Error(`Failed to get logs: ${error.message}`);
    }
  }

  // Helper methods
  static async getSystemLoad() {
    return {
      cpu: process.cpuUsage(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    };
  }

  static async getDatabaseSize() {
    // This would require MongoDB admin privileges
    return {
      estimated: 'N/A',
      collections: await BackupManager.getCollectionStats(),
    };
  }

  static async getAveragePetLevel() {
    const result = await Pet.aggregate([
      { $group: { _id: null, avgLevel: { $avg: '$level' } } },
    ]);
    return result[0]?.avgLevel || 1;
  }

  static async getEventsToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await GameEvent.countDocuments({
      timestamp: { $gte: today },
    });
  }

  static async getLastPetActivity(walletAddress) {
    const pets = await Pet.find({ owner: walletAddress });
    if (pets.length === 0) return null;

    const lastEvent = await GameEvent.findOne({
      petId: { $in: pets.map(p => p._id) },
    }).sort({ timestamp: -1 });

    return lastEvent?.timestamp || null;
  }

  static async cleanupOrphanedEvents() {
    const pets = await Pet.find({});
    const petIds = pets.map(pet => pet._id);

    const result = await GameEvent.deleteMany({
      petId: { $nin: petIds },
    });

    return { deleted: result.deletedCount };
  }

  static async recalculateAllStats() {
    const users = await User.find({});
    let updated = 0;

    for (const user of users) {
      const pets = await Pet.find({ owner: user.walletAddress });
      const totalPlayTime = pets.reduce((sum, pet) => sum + (pet.totalPlayTime || 0), 0);

      if (totalPlayTime !== user.totalPlayTime) {
        user.totalPlayTime = totalPlayTime;
        await user.save();
        updated++;
      }
    }

    return { updated };
  }
}

module.exports = AdminService;