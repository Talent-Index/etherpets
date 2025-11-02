const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

class BackupManager {
  static async createBackup(backupDir = './backups') {
    try {
      // Ensure backup directory exists
      await fs.mkdir(backupDir, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `etherpets-backup-${timestamp}`;
      const backupPath = path.join(backupDir, backupName);

      // Get database connection string
      const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/etherpets';
      
      // Use mongodump for backup
      const { stdout, stderr } = await execPromise(
        `mongodump --uri="${dbUri}" --out="${backupPath}"`
      );

      console.log('Backup created successfully:', backupPath);
      
      // Create metadata file
      const metadata = {
        timestamp: new Date().toISOString(),
        database: 'etherpets',
        version: '1.0',
        collections: await this.getCollectionStats(),
      };

      await fs.writeFile(
        path.join(backupPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      return {
        success: true,
        path: backupPath,
        metadata,
      };
    } catch (error) {
      console.error('Backup failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async restoreBackup(backupPath) {
    try {
      const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/etherpets';
      
      // Use mongorestore for restoration
      const { stdout, stderr } = await execPromise(
        `mongorestore --uri="${dbUri}" --drop "${backupPath}"`
      );

      console.log('Backup restored successfully');
      return { success: true };
    } catch (error) {
      console.error('Restore failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async getCollectionStats() {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const stats = {};
    
    for (const collection of collections) {
      const coll = db.collection(collection.name);
      stats[collection.name] = await coll.countDocuments();
    }
    
    return stats;
  }

  static async listBackups(backupDir = './backups') {
    try {
      const files = await fs.readdir(backupDir);
      const backups = [];

      for (const file of files) {
        const backupPath = path.join(backupDir, file);
        const stat = await fs.stat(backupPath);
        
        if (stat.isDirectory() && file.startsWith('etherpets-backup-')) {
          try {
            const metadataPath = path.join(backupPath, 'metadata.json');
            const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
            
            backups.push({
              name: file,
              path: backupPath,
              timestamp: metadata.timestamp,
              size: await this.getDirectorySize(backupPath),
              collections: metadata.collections,
            });
          } catch (error) {
            console.warn(`Could not read metadata for ${file}:`, error);
          }
        }
      }

      return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error listing backups:', error);
      return [];
    }
  }

  static async getDirectorySize(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    let size = 0;

    for (const file of files) {
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        size += await this.getDirectorySize(filePath);
      } else {
        const stat = await fs.stat(filePath);
        size += stat.size;
      }
    }

    return size;
  }

  static async cleanupOldBackups(backupDir = './backups', keepCount = 5) {
    try {
      const backups = await this.listBackups(backupDir);
      
      if (backups.length <= keepCount) {
        return { deleted: 0 };
      }

      const toDelete = backups.slice(keepCount);
      let deleted = 0;

      for (const backup of toDelete) {
        try {
          await fs.rm(backup.path, { recursive: true });
          deleted++;
          console.log(`Deleted old backup: ${backup.name}`);
        } catch (error) {
          console.error(`Failed to delete backup ${backup.name}:`, error);
        }
      }

      return { deleted };
    } catch (error) {
      console.error('Cleanup error:', error);
      return { error: error.message };
    }
  }
}

module.exports = BackupManager;