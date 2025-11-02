const { leaderboardCache, userCache, petCache } = require('../utils/cache');

const cacheMiddleware = (cacheInstance, ttl = null) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    
    // Try to get from cache first
    const cachedResponse = cacheInstance.get(key);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheInstance.set(key, data, ttl);
      }
      originalJson.call(this, data);
    };

    next();
  };
};

// Specific cache middlewares
const cacheLeaderboard = cacheMiddleware(leaderboardCache, 300); // 5 minutes
const cacheUserData = cacheMiddleware(userCache, 1800); // 30 minutes
const cachePetData = cacheMiddleware(petCache, 1800); // 30 minutes

// Clear cache on mutation operations
const clearCacheOnMutation = (cacheInstance, patterns = []) => {
  return (req, res, next) => {
    // Override res.json to clear cache after mutation
    const originalJson = res.json;
    res.json = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Clear relevant cache patterns
        patterns.forEach(pattern => {
          cacheInstance.delPattern(pattern);
        });
        // Also clear the specific request cache
        cacheInstance.del(req.originalUrl);
      }
      originalJson.call(this, data);
    };

    next();
  };
};

module.exports = {
  cacheMiddleware,
  cacheLeaderboard,
  cacheUserData,
  cachePetData,
  clearCacheOnMutation,
};