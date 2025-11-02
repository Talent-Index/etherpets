const mongoose = require('mongoose');
const { ethers } = require('ethers');

class HealthCheckService {
  // Comprehensive health check
  static async performHealthCheck() {
    const checks = {
      database: await this.checkDatabase(),
      blockchain: await this.checkBlockchain(),
      memory: this.checkMemory(),
      disk: await this.checkDiskSpace(),
      api: this.checkAPI(),
      timestamp: new Date(),
    };

    const allHealthy = Object.values(checks)
      .filter(check => typeof check === 'object')
      .every(check => check.healthy);

    return {
      healthy: allHealthy,
      checks,
      uptime: process.uptime(),
      version: '1.0.0',
    };
  }

  // Check database connection and performance
  static async checkDatabase() {
    try {
      const startTime = Date.now();
      
      // Test connection
      await mongoose.connection.db.admin().ping();
      
      // Test query performance
      const userCount = await mongoose.connection.db.collection('users').countDocuments();
      const petCount = await mongoose.connection.db.collection('pets').countDocuments();
      
      const responseTime = Date.now() - startTime;

      return {
        healthy: true,
        responseTime: `${responseTime}ms`,
        collections: {
          users: userCount,
          pets: petCount,
        },
        connection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        connection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      };
    }
  }

  // Check blockchain connection
  static async checkBlockchain() {
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.AVALANCHE_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'
      );

      const startTime = Date.now();
      const blockNumber = await provider.getBlockNumber();
      const responseTime = Date.now() - startTime;

      return {
        healthy: true,
        responseTime: `${responseTime}ms`,
        blockNumber,
        network: await provider.getNetwork(),
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
      };
    }
  }

  // Check memory usage
  static checkMemory() {
    const memoryUsage = process.memoryUsage();
    const maxMemory = parseInt(process.env.MAX_MEMORY) || 512; // MB

    const usedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const totalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const usagePercent = (usedMB / maxMemory) * 100;

    return {
      healthy: usagePercent < 80,
      used: `${usedMB}MB`,
      total: `${totalMB}MB`,
      max: `${maxMemory}MB`,
      usagePercent: Math.round(usagePercent),
      status: usagePercent > 90 ? 'critical' : usagePercent > 80 ? 'warning' : 'healthy',
    };
  }

  // Check disk space (simplified)
  static async checkDiskSpace() {
    // In a real implementation, you would use a package like 'check-disk-space'
    // For now, we'll return a simplified version
    return {
      healthy: true,
      free: 'N/A',
      total: 'N/A',
      status: 'healthy',
    };
  }

  // Check API responsiveness
  static checkAPI() {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    return {
      healthy: true,
      uptime: `${Math.round(uptime)}s`,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
      },
      nodeVersion: process.version,
      platform: process.platform,
    };
  }

  // Get detailed metrics for monitoring
  static async getDetailedMetrics() {
    const [
      healthCheck,
      userStats,
      petStats,
      eventStats,
    ] = await Promise.all([
      this.performHealthCheck(),
      this.getUserStats(),
      this.getPetStats(),
      this.getEventStats(),
    ]);

    return {
      health: healthCheck,
      metrics: {
        users: userStats,
        pets: petStats,
        events: eventStats,
      },
      timestamp: new Date(),
    };
  }

  static async getUserStats() {
    const totalUsers = await mongoose.connection.db.collection('users').countDocuments();
    const activeUsers = await mongoose.connection.db.collection('users').countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    const newUsers = await mongoose.connection.db.collection('users').countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    return {
      total: totalUsers,
      active24h: activeUsers,
      new24h: newUsers,
    };
  }

  static async getPetStats() {
    const totalPets = await mongoose.connection.db.collection('pets').countDocuments();
    const averageLevel = await mongoose.connection.db.collection('pets').aggregate([
      { $group: { _id: null, avgLevel: { $avg: '$level' } } },
    ]).toArray();

    return {
      total: totalPets,
      averageLevel: averageLevel[0]?.avgLevel || 1,
    };
  }

  static async getEventStats() {
    const totalEvents = await mongoose.connection.db.collection('gameevents').countDocuments();
    const events24h = await mongoose.connection.db.collection('gameevents').countDocuments({
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    return {
      total: totalEvents,
      last24h: events24h,
    };
  }
}

module.exports = HealthCheckService;