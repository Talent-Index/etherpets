const GameEvent = require('../models/GameEvent');
const Pet = require('../models/Pet');
const AIMoodService = require('../services/aiMoodService');

class GameController {
  // Get pet activity history
  static async getPetActivity(req, res) {
    try {
      const { petId } = req.params;
      const { limit = 20, page = 1 } = req.query;

      const events = await GameEvent.find({ petId })
        .sort({ timestamp: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const total = await GameEvent.countDocuments({ petId });

      res.json({
        success: true,
        data: {
          events,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching pet activity',
        error: error.message,
      });
    }
  }

  // Meditate with pet (special action)
  static async meditateWithPet(req, res) {
    try {
      const { petId } = req.params;
      const { duration } = req.body;

      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found',
        });
      }

      // Meditation benefits
      const benefits = this.calculateMeditationBenefits(duration);
      
      pet.energy = Math.min(100, pet.energy + benefits.energy);
      pet.happiness = Math.min(100, pet.happiness + benefits.happiness);
      pet.hunger = Math.max(0, pet.hunger - benefits.hunger);
      
      // Update hidden traits significantly for meditation
      pet.hiddenTraits.trust = Math.min(100, pet.hiddenTraits.trust + 3);
      pet.hiddenTraits.empathy = Math.min(100, pet.hiddenTraits.empathy + 2);
      
      pet.updateMood();
      const levelResult = pet.addExperience(benefits.experience);
      
      await pet.save();

      // Create meditation event
      const event = new GameEvent({
        petId: pet._id,
        type: 'meditate',
        description: `Meditated with ${pet.name} for ${duration} minutes`,
        energyChange: benefits.energy,
        happinessChange: benefits.happiness,
        hungerChange: -benefits.hunger,
        experienceGained: benefits.experience,
        hiddenTraitsChange: {
          trust: 3,
          empathy: 2,
          curiosity: 1,
        },
      });
      await event.save();

      // Generate AI mood message
      const moodMessage = AIMoodService.generateMoodMessage(pet, [event]);

      res.json({
        success: true,
        data: {
          pet,
          benefits,
          moodMessage,
          leveledUp: levelResult.leveledUp,
          newLevel: levelResult.newLevel,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error during meditation',
        error: error.message,
      });
    }
  }

  // Train pet (improve skills)
  static async trainPet(req, res) {
    try {
      const { petId } = req.params;
      const { trainingType } = req.body;

      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found',
        });
      }

      const trainingEffects = this.calculateTrainingEffects(trainingType);
      
      pet.energy = Math.max(0, pet.energy + trainingEffects.energy);
      pet.hunger = Math.max(0, pet.hunger + trainingEffects.hunger);
      
      // Training significantly improves hidden traits
      pet.hiddenTraits.trust += trainingEffects.trust;
      pet.hiddenTraits.curiosity += trainingEffects.curiosity;
      
      pet.updateMood();
      const levelResult = pet.addExperience(trainingEffects.experience);
      
      await pet.save();

      // Create training event
      const event = new GameEvent({
        petId: pet._id,
        type: 'train',
        description: `Trained ${pet.name} in ${trainingType}`,
        energyChange: trainingEffects.energy,
        hungerChange: trainingEffects.hunger,
        experienceGained: trainingEffects.experience,
        hiddenTraitsChange: {
          trust: trainingEffects.trust,
          curiosity: trainingEffects.curiosity,
        },
      });
      await event.save();

      res.json({
        success: true,
        data: {
          pet,
          trainingEffects,
          leveledUp: levelResult.leveledUp,
          newLevel: levelResult.newLevel,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error during training',
        error: error.message,
      });
    }
  }

  // Get pet insights (AI analysis)
  static async getPetInsights(req, res) {
    try {
      const { petId } = req.params;

      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found',
        });
      }

      // Get recent events for analysis
      const recentEvents = await GameEvent.find({ petId })
        .sort({ timestamp: -1 })
        .limit(50)
        .lean();

      // Generate AI insights
      const insights = {
        moodAnalysis: AIMoodService.analyzePetBehavior(recentEvents, pet.mood),
        moodMessage: AIMoodService.generateMoodMessage(pet, recentEvents),
        evolutionPrediction: AIMoodService.predictEvolution(pet),
        hiddenTraits: AIMoodService.analyzeHiddenTraits(recentEvents),
        recommendations: this.generateRecommendations(pet, recentEvents),
      };

      res.json({
        success: true,
        data: insights,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error generating insights',
        error: error.message,
      });
    }
  }

  // Calculate meditation benefits
  static calculateMeditationBenefits(duration) {
    const baseBenefits = {
      energy: duration * 0.5,
      happiness: duration * 0.8,
      hunger: duration * 0.2,
      experience: duration * 1.5,
    };
    
    return baseBenefits;
  }

  // Calculate training effects
  static calculateTrainingEffects(trainingType) {
    const trainingMap = {
      agility: { energy: -25, hunger: -15, trust: 2, curiosity: 3, experience: 20 },
      intelligence: { energy: -15, hunger: -10, trust: 3, curiosity: 4, experience: 25 },
      strength: { energy: -30, hunger: -20, trust: 4, curiosity: 2, experience: 30 },
    };
    
    return trainingMap[trainingType] || trainingMap.agility;
  }

  // Generate personalized recommendations
  static generateRecommendations(pet, events) {
    const recommendations = [];
    
    if (pet.hunger < 30) {
      recommendations.push({
        type: 'feed',
        priority: 'high',
        message: `${pet.name} is getting hungry. Consider feeding soon.`,
      });
    }
    
    if (pet.energy < 20) {
      recommendations.push({
        type: 'rest',
        priority: 'high',
        message: `${pet.name} seems tired. Some rest would help.`,
      });
    }
    
    if (pet.happiness < 40) {
      recommendations.push({
        type: 'play',
        priority: 'medium',
        message: `${pet.name} could use some fun activities.`,
      });
    }
    
    // Check for activity variety
    const recentTypes = events.slice(0, 5).map(e => e.type);
    const uniqueTypes = new Set(recentTypes);
    
    if (uniqueTypes.size < 3) {
      recommendations.push({
        type: 'variety',
        priority: 'low',
        message: 'Try different activities to keep things interesting!',
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
}

module.exports = GameController;