const mongoose = require('mongoose');
const Pet = require('../models/Pet');
const User = require('../models/User');
const GameEvent = require('../models/GameEvent');

class DataMigration {
  // Migrate user data to new schema
  static async migrateUserSchema() {
    try {
      const users = await User.find({});
      let migrated = 0;

      for (const user of users) {
        // Add missing fields with default values
        const updates = {};
        
        if (!user.streak) updates.streak = 0;
        if (!user.totalPlayTime) updates.totalPlayTime = 0;
        if (!user.preferences) {
          updates.preferences = {
            theme: 'dark',
            notifications: true,
          };
        }

        if (Object.keys(updates).length > 0) {
          await User.updateOne({ _id: user._id }, { $set: updates });
          migrated++;
        }
      }

      console.log(`Migrated ${migrated} users`);
      return { success: true, migrated };
    } catch (error) {
      console.error('User migration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Migrate pet data to new schema
  static async migratePetSchema() {
    try {
      const pets = await Pet.find({});
      let migrated = 0;

      for (const pet of pets) {
        const updates = {};

        // Ensure all required fields exist
        if (!pet.hiddenTraits) {
          updates.hiddenTraits = {
            trust: 50,
            empathy: 50,
            curiosity: 50,
          };
        }

        if (!pet.traits) {
          updates.traits = {
            color: '#4ECDC4',
            pattern: 'solid',
            size: 'medium',
          };
        }

        if (!pet.lastFed) updates.lastFed = pet.createdAt;
        if (!pet.lastPlayed) updates.lastPlayed = pet.createdAt;
        if (!pet.birthDate) updates.birthDate = pet.createdAt;

        if (Object.keys(updates).length > 0) {
          await Pet.updateOne({ _id: pet._id }, { $set: updates });
          migrated++;
        }
      }

      console.log(`Migrated ${migrated} pets`);
      return { success: true, migrated };
    } catch (error) {
      console.error('Pet migration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Clean up orphaned events (events without pets)
  static async cleanupOrphanedEvents() {
    try {
      const pets = await Pet.find({});
      const petIds = pets.map(pet => pet._id);

      const result = await GameEvent.deleteMany({
        petId: { $nin: petIds },
      });

      console.log(`Cleaned up ${result.deletedCount} orphaned events`);
      return { success: true, deleted: result.deletedCount };
    } catch (error) {
      console.error('Cleanup error:', error);
      return { success: false, error: error.message };
    }
  }

  // Recalculate user streaks
  static async recalculateStreaks() {
    try {
      const users = await User.find({});
      let updated = 0;

      for (const user of users) {
        // Simple streak calculation based on last login
        const today = new Date();
        const lastLogin = new Date(user.lastLogin);
        const daysSinceLogin = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

        let newStreak = user.streak || 0;
        
        if (daysSinceLogin === 0) {
          // Logged in today, maintain streak
          newStreak = Math.max(1, newStreak);
        } else if (daysSinceLogin === 1) {
          // Logged in yesterday, continue streak
          newStreak = (newStreak || 0) + 1;
        } else {
          // Break in streak, reset to 1 if logged in today
          newStreak = daysSinceLogin === 0 ? 1 : 0;
        }

        if (newStreak !== user.streak) {
          await User.updateOne({ _id: user._id }, { $set: { streak: newStreak } });
          updated++;
        }
      }

      console.log(`Updated streaks for ${updated} users`);
      return { success: true, updated };
    } catch (error) {
      console.error('Streak recalculation error:', error);
      return { success: false, error: error.message };
    }
  }

  // Backfill missing event data
  static async backfillEventData() {
    try {
      const events = await GameEvent.find({
        $or: [
          { energyChange: { $exists: false } },
          { hungerChange: { $exists: false } },
          { happinessChange: { $exists: false } },
        ],
      });

      let updated = 0;

      for (const event of events) {
        const updates = {};

        // Set default values for missing fields
        if (event.energyChange === undefined) updates.energyChange = 0;
        if (event.hungerChange === undefined) updates.hungerChange = 0;
        if (event.happinessChange === undefined) updates.happinessChange = 0;
        if (event.experienceGained === undefined) updates.experienceGained = 0;

        if (Object.keys(updates).length > 0) {
          await GameEvent.updateOne({ _id: event._id }, { $set: updates });
          updated++;
        }
      }

      console.log(`Backfilled ${updated} events`);
      return { success: true, updated };
    } catch (error) {
      console.error('Event backfill error:', error);
      return { success: false, error: error.message };
    }
  }

  // Run all migrations
  static async runAllMigrations() {
    console.log('Starting data migrations...');
    
    const results = {
      users: await this.migrateUserSchema(),
      pets: await this.migratePetSchema(),
      orphanedEvents: await this.cleanupOrphanedEvents(),
      streaks: await this.recalculateStreaks(),
      events: await this.backfillEventData(),
    };

    console.log('Migration results:', results);
    return results;
  }
}

module.exports = DataMigration;