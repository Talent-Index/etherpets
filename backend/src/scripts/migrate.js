require('dotenv').config();
const mongoose = require('mongoose');
const DataMigration = require('../utils/dataMigration');

const runMigrations = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/etherpets', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to database');
    
    // Run migrations
    const results = await DataMigration.runAllMigrations();
    
    console.log('\n=== Migration Summary ===');
    Object.entries(results).forEach(([migration, result]) => {
      console.log(`${migration}: ${result.success ? '✅' : '❌'} ${result.error || 'Success'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;