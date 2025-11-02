const Pet = require('../models/Pet');
const GameEvent = require('../models/GameEvent');

class PetDecayService {
  // Calculate decay based on time since last interaction
  static calculateDecay(pet) {
    const now = new Date();
    const hoursSinceFed = (now - new Date(pet.lastFed)) / (1000 * 60 * 60);
    const hoursSincePlayed = (now - new Date(pet.lastPlayed)) / (1000 * 60 * 60);
    
    const decay = {
      hunger: Math.min(100, Math.floor(hoursSinceFed * 2)), // Hunger increases faster
      energy: Math.max(0, 100 - Math.floor(hoursSincePlayed * 3)), // Energy depletes
      happiness: Math.max(0, 100 - Math.floor(Math.max(hoursSinceFed, hoursSincePlayed) * 1.5)),
    };
    
    return decay;
  }

  // Apply decay to pet stats
  static applyDecay(pet) {
    const decay = this.calculateDecay(pet);
    
    pet.hunger = Math.max(0, pet.hunger - decay.hunger);
    pet.energy = decay.energy;
    pet.happiness = decay.happiness;
    
    // Update mood based on new stats
    pet.updateMood();
    
    return pet;
  }

  // Check and apply decay for all pets (cron job)
  static async applyGlobalDecay() {
    try {
      const pets = await Pet.find({
        $or: [
          { lastFed: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // Older than 24h
          { lastPlayed: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        ]
      });

      const results = {
        updated: 0,
        skipped: 0,
        errors: 0,
      };

      for (const pet of pets) {
        try {
          const beforeStats = {
            hunger: pet.hunger,
            energy: pet.energy,
            happiness: pet.happiness,
          };

          this.applyDecay(pet);
          
          // Only save if there are changes
          if (pet.hunger !== beforeStats.hunger || 
              pet.energy !== beforeStats.energy || 
              pet.happiness !== beforeStats.happiness) {
            
            await pet.save();
            
            // Create decay event for significant changes
            if (pet.hunger < 30 || pet.energy < 20 || pet.happiness < 30) {
              const event = new GameEvent({
                petId: pet._id,
                type: 'decay',
                description: `${pet.name} is showing signs of neglect`,
                hungerChange: beforeStats.hunger - pet.hunger,
                energyChange: beforeStats.energy - pet.energy,
                happinessChange: beforeStats.happiness - pet.happiness,
              });
              await event.save();
            }
            
            results.updated++;
          } else {
            results.skipped++;
          }
        } catch (error) {
          console.error(`Error updating pet ${pet._id}:`, error);
          results.errors++;
        }
      }

      console.log(`Pet decay update completed:`, results);
      return results;
    } catch (error) {
      console.error('Error in global decay service:', error);
      throw error;
    }
  }

  // Calculate recovery time for neglected pet
  static calculateRecoveryTime(pet) {
    const decay = this.calculateDecay(pet);
    const recoveryActions = {
      hunger: Math.ceil(decay.hunger / 25), // Each feed restores ~25 hunger
      energy: Math.ceil((100 - decay.energy) / 20), // Each rest restores ~20 energy
      happiness: Math.ceil((100 - decay.happiness) / 15), // Each play restores ~15 happiness
    };
    
    return {
      actionsNeeded: recoveryActions,
      estimatedTime: Math.max(...Object.values(recoveryActions)) * 30, // 30 minutes per action
    };
  }
}

module.exports = PetDecayService;