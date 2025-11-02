const SecurityUtils = require('../utils/security');

module.exports = {
  // Production-specific configuration
  port: process.env.PORT || 5000,
  
  // Security
  security: {
    rateLimiting: SecurityUtils.getRateLimits(),
    cors: SecurityUtils.getCorsOptions(),
    headers: SecurityUtils.securityHeaders,
  },

  // Database
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Production-specific options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  // Logging
  logging: {
    level: 'info',
    format: 'combined', // Use 'combined' for more detailed logs
  },

  // Monitoring
  monitoring: {
    enabled: true,
    // Integration with services like Datadog, New Relic, etc.
  },

  // Cache (if using Redis)
  cache: {
    enabled: process.env.REDIS_URL ? true : false,
    url: process.env.REDIS_URL,
  },

  // Performance
  performance: {
    compression: true,
    helmet: true,
    // Add other performance optimizations
  },
};