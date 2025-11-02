// Game constants and configuration
const GameConstants = {
  // Pet stats
  STATS: {
    MAX_ENERGY: 100,
    MAX_HUNGER: 100,
    MAX_HAPPINESS: 100,
    MIN_STAT: 0,
  },

  // Experience and leveling
  LEVELING: {
    BASE_EXP: 100,
    EXP_MULTIPLIER: 1.5,
    MAX_LEVEL: 100,
  },

  // Activity effects
  ACTIVITIES: {
    FEED: {
      BASIC: { hunger: 25, energy: 5, happiness: 5, experience: 5 },
      PREMIUM: { hunger: 40, energy: 10, happiness: 15, experience: 10 },
      TREAT: { hunger: 10, energy: -5, happiness: 20, experience: 8 },
    },
    PLAY: {
      FETCH: { energy: -15, happiness: 20, hunger: -10, experience: 8 },
      PUZZLE: { energy: -5, happiness: 15, hunger: -5, experience: 12 },
      TRAINING: { energy: -20, happiness: 10, hunger: -15, experience: 15 },
    },
    MEDITATE: {
      SHORT: { energy: 10, happiness: 15, hunger: -5, experience: 10 },
      MEDIUM: { energy: 20, happiness: 25, hunger: -8, experience: 20 },
      LONG: { energy: 30, happiness: 35, hunger: -12, experience: 30 },
    },
  },

  // Decay rates (per hour)
  DECAY: {
    HUNGER: 2,
    ENERGY: 3,
    HAPPINESS: 1.5,
  },

  // Evolution requirements
  EVOLUTION: {
    LEVEL_REQUIREMENTS: [5, 10, 20, 35, 50],
    HIDDEN_TRAIT_THRESHOLD: 80,
  },

  // Marketplace
  MARKETPLACE: {
    MIN_LISTING_PRICE: 1,
    MAX_LISTING_PRICE: 10000,
    TRANSACTION_FEE: 0.025, // 2.5%
  },

  // Quests
  QUESTS: {
    DAILY_RESET_HOUR: 0, // Midnight UTC
    WEEKLY_RESET_DAY: 1, // Monday
  },

  // Seasons
  SEASONS: {
    DURATION_DAYS: 90,
    REWARD_DISTRIBUTION: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Top 10 get rewards
  },

  // Achievement points
  ACHIEVEMENT_POINTS: {
    COMMON: 10,
    RARE: 25,
    EPIC: 50,
    LEGENDARY: 100,
  },

  // API limits
  API_LIMITS: {
    MAX_PETS_PER_USER: 5,
    MAX_EVENTS_PER_DAY: 1000,
    MAX_MARKETPLACE_LISTINGS: 10,
  },

  // Blockchain
  BLOCKCHAIN: {
    CONFIRMATIONS_REQUIRED: 3,
    GAS_LIMIT: 300000,
    MAX_PRIORITY_FEE: '2.0', // Gwei
  },
};

// Error messages
const ErrorMessages = {
  // Authentication errors
  AUTH: {
    NO_TOKEN: 'No authentication token provided',
    INVALID_TOKEN: 'Invalid authentication token',
    WALLET_REQUIRED: 'Wallet address is required',
    SIGNATURE_INVALID: 'Invalid signature',
  },

  // Pet errors
  PET: {
    NOT_FOUND: 'Pet not found',
    NOT_OWNER: 'You are not the owner of this pet',
    ALREADY_EXISTS: 'User already has a pet',
    MAX_PETS_REACHED: 'Maximum number of pets reached',
    INVALID_SPECIES: 'Invalid pet species',
  },

  // User errors
  USER: {
    NOT_FOUND: 'User not found',
    ALREADY_EXISTS: 'User already exists',
    INVALID_USERNAME: 'Invalid username format',
  },

  // Game errors
  GAME: {
    INSUFFICIENT_ENERGY: 'Pet does not have enough energy',
    INVALID_ACTION: 'Invalid game action',
    COOLDOWN_ACTIVE: 'Action is on cooldown',
    DAILY_LIMIT_REACHED: 'Daily limit reached for this action',
  },

  // Marketplace errors
  MARKETPLACE: {
    NOT_LISTED: 'Pet is not listed for sale',
    PRICE_MISMATCH: 'Price does not match listing',
    INSUFFICIENT_FUNDS: 'Insufficient funds',
    SELF_PURCHASE: 'Cannot purchase your own pet',
  },

  // Validation errors
  VALIDATION: {
    INVALID_INPUT: 'Invalid input provided',
    MISSING_FIELDS: 'Required fields are missing',
    OUT_OF_RANGE: 'Value is out of acceptable range',
  },
};

// Success messages
const SuccessMessages = {
  PET: {
    CREATED: 'Pet created successfully',
    UPDATED: 'Pet updated successfully',
    FED: 'Pet fed successfully',
    PLAYED: 'Play session completed',
    EVOLVED: 'Pet evolved successfully',
  },
  USER: {
    REGISTERED: 'User registered successfully',
    LOGGED_IN: 'Login successful',
    PROFILE_UPDATED: 'Profile updated successfully',
  },
  MARKETPLACE: {
    LISTED: 'Pet listed successfully',
    PURCHASED: 'Purchase completed successfully',
    LISTING_REMOVED: 'Listing removed successfully',
  },
  QUEST: {
    COMPLETED: 'Quest completed',
    REWARD_CLAIMED: 'Reward claimed successfully',
  },
  ACHIEVEMENT: {
    UNLOCKED: 'Achievement unlocked',
  },
};

module.exports = {
  GameConstants,
  ErrorMessages,
  SuccessMessages,
};