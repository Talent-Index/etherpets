const PDFDocument = require('pdfkit');
const Pet = require('../models/Pet');
const User = require('../models/User');
const GameEvent = require('../models/GameEvent');

class ExportService {
  // Generate PDF report for a pet
  static async generatePetReport(petId) {
    return new Promise(async (resolve, reject) => {
      try {
        const pet = await Pet.findById(petId);
        if (!pet) {
          throw new Error('Pet not found');
        }

        const events = await GameEvent.find({ petId })
          .sort({ timestamp: -1 })
          .limit(100);

        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Add content to PDF
        this.addPetReportContent(doc, pet, events);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  static addPetReportContent(doc, pet, events) {
    // Header
    doc.fontSize(20).text('EtherPets Care Report', { align: 'center' });
    doc.moveDown();
    
    // Pet Information
    doc.fontSize(16).text('Pet Information', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${pet.name}`);
    doc.text(`Species: ${pet.species}`);
    doc.text(`Level: ${pet.level}`);
    doc.text(`Birth Date: ${new Date(pet.birthDate).toLocaleDateString()}`);
    doc.moveDown();

    // Current Stats
    doc.fontSize(14).text('Current Statistics', { underline: true });
    doc.fontSize(12);
    doc.text(`Happiness: ${pet.happiness}/100`);
    doc.text(`Energy: ${pet.energy}/100`);
    doc.text(`Hunger: ${pet.hunger}/100`);
    doc.text(`Mood: ${pet.mood}`);
    doc.moveDown();

    // Hidden Traits
    doc.fontSize(14).text('Hidden Traits', { underline: true });
    doc.fontSize(12);
    doc.text(`Trust: ${pet.hiddenTraits.trust}/100`);
    doc.text(`Empathy: ${pet.hiddenTraits.empathy}/100`);
    doc.text(`Curiosity: ${pet.hiddenTraits.curiosity}/100`);
    doc.moveDown();

    // Recent Activity
    doc.fontSize(14).text('Recent Activity', { underline: true });
    doc.fontSize(10);
    
    events.slice(0, 20).forEach((event, index) => {
      if (index > 0 && index % 5 === 0) {
        doc.addPage();
      }
      
      doc.text(
        `${new Date(event.timestamp).toLocaleDateString()} - ${event.type}: ${event.description}`
      );
    });

    // Footer
    doc.text(`Report generated on ${new Date().toLocaleDateString()}`, { align: 'center' });
  }

  // Export user data in JSON format
  static async exportUserData(walletAddress) {
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) {
        throw new Error('User not found');
      }

      const pets = await Pet.find({ owner: walletAddress });
      const events = await GameEvent.find({ 
        petId: { $in: pets.map(p => p._id) } 
      });

      const exportData = {
        user: {
          walletAddress: user.walletAddress,
          username: user.username,
          streak: user.streak,
          createdAt: user.createdAt,
          achievements: user.achievements || [],
        },
        pets: pets.map(pet => ({
          name: pet.name,
          species: pet.species,
          level: pet.level,
          mood: pet.mood,
          stats: {
            happiness: pet.happiness,
            energy: pet.energy,
            hunger: pet.hunger,
          },
          hiddenTraits: pet.hiddenTraits,
          birthDate: pet.birthDate,
        })),
        activity: events.map(event => ({
          type: event.type,
          description: event.description,
          timestamp: event.timestamp,
          changes: {
            energy: event.energyChange,
            hunger: event.hungerChange,
            happiness: event.happinessChange,
            experience: event.experienceGained,
          },
        })),
        exportDate: new Date().toISOString(),
        version: '1.0',
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      throw new Error(`Export failed: ${error.message}`);
    }
  }

  // Generate CSV report for analytics
  static async generateCSVReport(walletAddress, startDate, endDate) {
    try {
      const pets = await Pet.find({ owner: walletAddress });
      const events = await GameEvent.find({
        petId: { $in: pets.map(p => p._id) },
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      }).sort({ timestamp: 1 });

      let csv = 'Date,Pet Name,Activity Type,Description,Energy Change,Hunger Change,Happiness Change,Experience Gained\n';
      
      events.forEach(event => {
        const pet = pets.find(p => p._id.toString() === event.petId.toString());
        const row = [
          new Date(event.timestamp).toISOString().split('T')[0],
          pet?.name || 'Unknown',
          event.type,
          `"${event.description}"`,
          event.energyChange || 0,
          event.hungerChange || 0,
          event.happinessChange || 0,
          event.experienceGained || 0,
        ].join(',');
        
        csv += row + '\n';
      });

      return csv;
    } catch (error) {
      throw new Error(`CSV generation failed: ${error.message}`);
    }
  }
}

module.exports = ExportService;