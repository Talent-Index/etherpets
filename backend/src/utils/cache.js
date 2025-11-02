const NodeCache = require('node-cache');

class CacheService {
  constructor(ttlSeconds = 3600) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  // Get value from cache
  get(key) {
    return this.cache.get(key);
  }

  // Set value in cache
  set(key, value, ttl = null) {
    if (ttl) {
      this.cache.set(key, value, ttl);
    } else {
      this.cache.set(key, value);
    }
  }

  // Delete value from cache
  del(keys) {
    this.cache.del(keys);
  }

  // Flush all cache
  flush() {
    this.cache.flushAll();
  }

  // Get multiple keys
  mget(keys) {
    return this.cache.mget(keys);
  }

  // Set multiple keys
  mset(keyValueMap) {
    this.cache.mset(keyValueMap);
  }

  // Get cache statistics
  getStats() {
    return this.cache.getStats();
  }

  // Cache wrapper for async functions
  async wrap(key, asyncFunction, ttl = null) {
    const value = this.get(key);
    if (value) {
      return value;
    }

    const result = await asyncFunction();
    this.set(key, result, ttl);
    return result;
  }

  // Pattern-based key deletion
  delPattern(pattern) {
    const keys = this.cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    this.del(matchingKeys);
  }
}

// Create cache instances for different purposes
const leaderboardCache = new CacheService(300); // 5 minutes TTL
const userCache = new CacheService(1800); // 30 minutes TTL
const petCache = new CacheService(1800); // 30 minutes TTL
const marketplaceCache = new CacheService(60); // 1 minute TTL

module.exports = {
  CacheService,
  leaderboardCache,
  userCache,
  petCache,
  marketplaceCache,
};