require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Season = require('../models/Season');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/etherpets', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to database');

    // Clear existing data (optional - be careful in production!)
    if (process.env.NODE_ENV === 'development') {
      await User.deleteMany({});
      await Pet.deleteMany({});
      await Season.deleteMany({});
      console.log('Cleared existing data');
    }

    // Create test users
    const testUsers = [
      {
        walletAddress: '0x742E4C2F4C7cf5e4B7a4C8e8B2a3B4C5D6E7F8A9B',
        username: 'TestUser1',
        streak: 5,
        achievementPoints: 150,
      },
      {
        walletAddress: '0x843F5A3C8e8B2a3B4C5D6E7F8A9B0C1D2E3F4A5B',
        username: 'TestUser2',
        streak: 12,
        achievementPoints: 280,
      },
      {
        walletAddress: '0x954G6B4D9e8B2a3B4C5D6E7F8A9B0C1D2E3F4A5C',
        username: 'TestUser3',
        streak: 2,
        achievementPoints: 75,
      },
    ];

    const createdUsers = await User.insertMany(testUsers);
    console.log(`Created ${createdUsers.length} test users`);

    // Create test pets
    const testPets = [
      {
        name: 'Sparky',
        owner: testUsers[0].walletAddress,
        species: 'dragon',
        level: 8,
        happiness: 85,
        energy: 70,
        hunger: 90,
        traits: {
          color: '#FF6B6B',
          pattern: 'spots',
          size: 'medium',
        },
        hiddenTraits: {
          trust: 65,
          empathy: 70,
          curiosity: 60,
        },
      },
      {
        name: 'Blaze',
        owner: testUsers[1].walletAddress,
        species: 'phoenix',
        level: 15,
        happiness: 95,
        energy: 80,
        hunger: 75,
        traits: {
          color: '#FFD700',
          pattern: 'gradient',
          size: 'large',
        },
        hiddenTraits: {
          trust: 80,
          empathy: 85,
          curiosity: 75,
        },
      },
      {
        name: 'Mystic',
        owner: testUsers[2].walletAddress,
        species: 'unicorn',
        level: 3,
        happiness: 70,
        energy: 90,
        hunger: 60,
        traits: {
          color: '#C9A0DC',
          pattern: 'sparkles',
          size: 'small',
        },
        hiddenTraits: {
          trust: 45,
          empathy: 50,
          curiosity: 65,
        },
      },
    ];

    const createdPets = await Pet.insertMany(testPets);
    console.log(`Created ${createdPets.length} test pets`);

    // Create test season
    const testSeason = new Season({
      name: 'Season of Growth',
      seasonId: 'season-1',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      description: 'The inaugural season of EtherPets! Focus on growth and exploration.',
      rewards: {
        topPlayers: [
          { rank: 1, reward: { type: 'coins', value: 1000 } },
          { rank: 2, reward: { type: 'coins', value: 750 } },
          { rank: 3, reward: { type: 'coins', value: 500 } },
          { rank: 4, reward: { type: 'coins', value: 400 } },
          { rank: 5, reward: { type: 'coins', value: 300 } },
        ],
        participation: { type: 'coins', value: 100 },
      },
      active: true,
    });

    // Add some leaderboard entries
    testSeason.leaderboard.set(testUsers[0].walletAddress, {
      walletAddress: testUsers[0].walletAddress,
      score: 1250,
      rank: 1,
      rewardsClaimed: false,
    });

    testSeason.leaderboard.set(testUsers[1].walletAddress, {
      walletAddress: testUsers[1].walletAddress,
      score: 980,
      rank: 2,
      rewardsClaimed: false,
    });

    await testSeason.save();
    console.log('Created test season');

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;