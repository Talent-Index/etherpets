const Pet = require('../models/Pet');
const GameEvent = require('../models/GameEvent');

class PetController {
  // Create a new pet
  static async createPet(req, res) {
    try {
      const { name, species, owner } = req.body;
      
      const existingPet = await Pet.findOne({ owner });
      if (existingPet) {
        return res.status(400).json({
          success: false,
          message: 'User already has a pet',
        });
      }

      const pet = new Pet({
        name,
        species,
        owner,
        traits: {
          color: this.generateRandomColor(),
          pattern: this.generateRandomPattern(),
        },
      });

      await pet.save();

      // Create birth event
      const birthEvent = new GameEvent({
        petId: pet._id,
        type: 'social',
        description: `${pet.name} was born!`,
        happinessChange: 10,
        experienceGained: 10,
      });
      await birthEvent.save();

      res.status(201).json({
        success: true,
        data: pet,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating pet',
        error: error.message,
      });
    }
  }

  // Get pet by owner
  static async getPetByOwner(req, res) {
    try {
      const { owner } = req.params;
      
      const pet = await Pet.findOne({ owner });
      if (!pet) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found',
        });
      }

      res.json({
        success: true,
        data: pet,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching pet',
        error: error.message,
      });
    }
  }

  // Feed the pet
  static async feedPet(req, res) {
    try {
      const { petId } = req.params;
      const { foodType } = req.body;

      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found',
        });
      }

      // Calculate changes based on food type
      const changes = this.calculateFeedingChanges(foodType);
      
      pet.hunger = Math.min(100, pet.hunger + changes.hunger);
      pet.energy += changes.energy;
      pet.happiness += changes.happiness;
      pet.lastFed = new Date();
      
      // Update mood
      pet.updateMood();
      
      // Add experience
      const levelResult = pet.addExperience(changes.experience);
      
      await pet.save();

      // Create feed event
      const event = new GameEvent({
        petId: pet._id,
        type: 'feed',
        description: `Fed ${pet.name} with ${foodType}`,
        hungerChange: changes.hunger,
        energyChange: changes.energy,
        happinessChange: changes.happiness,
        experienceGained: changes.experience,
        hiddenTraitsChange: {
          trust: 1,
        },
      });
      await event.save();

      res.json({
        success: true,
        data: {
          pet,
          leveledUp: levelResult.leveledUp,
          newLevel: levelResult.newLevel,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error feeding pet',
        error: error.message,
      });
    }
  }

  // Play with pet
  static async playWithPet(req, res) {
    try {
      const { petId } = req.params;
      const { gameType } = req.body;

      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found',
        });
      }

      // Calculate changes based on game type
      const changes = this.calculatePlayChanges(gameType);
      
      pet.energy = Math.max(0, pet.energy + changes.energy);
      pet.happiness = Math.min(100, pet.happiness + changes.happiness);
      pet.hunger += changes.hunger;
      pet.lastPlayed = new Date();
      
      pet.updateMood();
      const levelResult = pet.addExperience(changes.experience);
      
      await pet.save();

      // Create play event
      const event = new GameEvent({
        petId: pet._id,
        type: 'play',
        description: `Played ${gameType} with ${pet.name}`,
        energyChange: changes.energy,
        happinessChange: changes.happiness,
        hungerChange: changes.hunger,
        experienceGained: changes.experience,
        hiddenTraitsChange: {
          empathy: 2,
          curiosity: 1,
        },
      });
      await event.save();

      res.json({
        success: true,
        data: {
          pet,
          leveledUp: levelResult.leveledUp,
          newLevel: levelResult.newLevel,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error playing with pet',
        error: error.message,
      });
    }
  }

  // Helper methods
  static generateRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  static generateRandomPattern() {
    const patterns = ['spots', 'stripes', 'solid', 'gradient', 'sparkles'];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  static calculateFeedingChanges(foodType) {
    const foodEffects = {
      basic: { hunger: 25, energy: 5, happiness: 5, experience: 5 },
      premium: { hunger: 40, energy: 10, happiness: 15, experience: 10 },
      treat: { hunger: 10, energy: -5, happiness: 20, experience: 8 },
    };
    return foodEffects[foodType] || foodEffects.basic;
  }

  static calculatePlayChanges(gameType) {
    const gameEffects = {
      fetch: { energy: -15, happiness: 20, hunger: -10, experience: 8 },
      puzzle: { energy: -5, happiness: 15, hunger: -5, experience: 12 },
      training: { energy: -20, happiness: 10, hunger: -15, experience: 15 },
    };
    return gameEffects[gameType] || gameEffects.fetch;
  }
}

module.exports = PetController;