require('dotenv').config();
const mongoose = require('mongoose');
const BackupManager = require('../utils/backupManager');

const runBackup = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/etherpets', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to database');
    console.log('Starting backup...');

    // Create backup
    const result = await BackupManager.createBackup();

    if (result.success) {
      console.log('Backup created successfully:', result.path);
      
      // List all backups
      const backups = await BackupManager.listBackups();
      console.log(`Total backups: ${backups.length}`);
      
      // Clean up old backups (keep last 5)
      const cleanupResult = await BackupManager.cleanupOldBackups('./backups', 5);
      console.log(`Cleaned up ${cleanupResult.deleted} old backups`);
    } else {
      console.error('Backup failed:', result.error);
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('Backup process failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runBackup();
}

module.exports = runBackup;