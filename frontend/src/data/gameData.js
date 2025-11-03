/**
 * Game Data and Configuration
 * Central repository for game-related constants, configurations, and data
 */

// Energy and Token configurations
export const ENERGY_CONFIG = {
  MAX_ENERGY: 100,
  STARTING_ENERGY: 100,
  ENERGY_REGEN_RATE: 1, // Energy points per minute
  ENERGY_REGEN_INTERVAL: 60000, // 1 minute in milliseconds
  LOW_ENERGY_THRESHOLD: 20
}

export const TOKEN_CONFIG = {
  STARTING_TOKENS: 50,
  DAILY_LOGIN_REWARD: 10,
  RITUAL_COMPLETION_REWARD: 5,
  STREAK_MULTIPLIER: 1.5
}

// Pet Experience and Leveling
export const PET_LEVELS = {
  1: { xpRequired: 0, name: 'Newborn', evolutionStage: 'baby' },
  2: { xpRequired: 100, name: 'Infant', evolutionStage: 'baby' },
  3: { xpRequired: 250, name: 'Child', evolutionStage: 'child' },
  4: { xpRequired: 500, name: 'Adolescent', evolutionStage: 'teen' },
  5: { xpRequired: 1000, name: 'Young Adult', evolutionStage: 'teen' },
  6: { xpRequired: 2000, name: 'Adult', evolutionStage: 'adult' },
  7: { xpRequired: 4000, name: 'Mature', evolutionStage: 'adult' },
  8: { xpRequired: 8000, name: 'Elder', evolutionStage: 'elder' },
  9: { xpRequired: 15000, name: 'Ancient', evolutionStage: 'elder' },
  10: { xpRequired: 30000, name: 'Legendary', evolutionStage: 'legendary' }
}

// Pet Activities and their effects
export const PET_ACTIVITIES = {
  feed: {
    name: 'Feed',
    energyCost: 0,
    happinessBoost: 10,
    energyBoost: 20,
    xpGain: 5,
    cooldown: 14400000 // 4 hours
  },
  play: {
    name: 'Play',
    energyCost: 10,
    happinessBoost: 20,
    energyBoost: -10,
    xpGain: 10,
    cooldown: 7200000 // 2 hours
  },
  rest: {
    name: 'Rest',
    energyCost: 0,
    happinessBoost: 5,
    energyBoost: 30,
    xpGain: 3,
    cooldown: 21600000 // 6 hours
  },
  meditate: {
    name: 'Meditate',
    energyCost: 5,
    happinessBoost: 15,
    energyBoost: 0,
    xpGain: 15,
    cooldown: 10800000 // 3 hours
  }
}

// Streak rewards and milestones
export const STREAK_REWARDS = {
  3: { tokens: 25, title: '3-Day Warrior', badge: '🔥' },
  7: { tokens: 75, title: 'Week Champion', badge: '⭐' },
  14: { tokens: 200, title: 'Fortnight Master', badge: '💎' },
  30: { tokens: 500, title: 'Monthly Legend', badge: '👑' },
  60: { tokens: 1200, title: 'Dedication Sage', badge: '🌟' },
  100: { tokens: 2500, title: 'Centurion', badge: '🏆' }
}

// Garden activities and node types
export const GARDEN_ACTIVITIES = {
  puzzle: {
    name: 'Collaborative Puzzle',
    minPlayers: 2,
    maxPlayers: 4,
    duration: 600, // 10 minutes in seconds
    energyCost: 3,
    rewards: {
      tokens: 20,
      xp: 15,
      harmony: 10
    }
  },
  meditation: {
    name: 'Group Meditation',
    minPlayers: 1,
    maxPlayers: 10,
    duration: 300, // 5 minutes
    energyCost: 2,
    rewards: {
      tokens: 10,
      xp: 10,
      harmony: 15
    }
  },
  social: {
    name: 'Social Gathering',
    minPlayers: 3,
    maxPlayers: 8,
    duration: 900, // 15 minutes
    energyCost: 4,
    rewards: {
      tokens: 25,
      xp: 12,
      harmony: 20
    }
  },
  reflection: {
    name: 'Reflection Circle',
    minPlayers: 2,
    maxPlayers: 6,
    duration: 480, // 8 minutes
    energyCost: 2,
    rewards: {
      tokens: 15,
      xp: 18,
      harmony: 12
    }
  }
}

// Seasonal events configuration
export const SEASONAL_EVENTS = {
  spring: {
    name: 'Spring Bloom',
    duration: 7, // days
    bonusMultiplier: 1.5,
    specialRewards: ['Spring Flower Badge', 'Bloom Crown'],
    theme: {
      primary: '#10B981',
      secondary: '#34D399'
    }
  },
  summer: {
    name: 'Summer Solstice',
    duration: 7,
    bonusMultiplier: 1.5,
    specialRewards: ['Sun Medallion', 'Solar Wings'],
    theme: {
      primary: '#F59E0B',
      secondary: '#FBBF24'
    }
  },
  autumn: {
    name: 'Harvest Moon',
    duration: 7,
    bonusMultiplier: 1.5,
    specialRewards: ['Moon Amulet', 'Autumn Leaves'],
    theme: {
      primary: '#EF4444',
      secondary: '#F87171'
    }
  },
  winter: {
    name: 'Winter Wonder',
    duration: 7,
    bonusMultiplier: 1.5,
    specialRewards: ['Snowflake Crown', 'Ice Crystal'],
    theme: {
      primary: '#3B82F6',
      secondary: '#60A5FA'
    }
  }
}

// Achievement definitions
export const ACHIEVEMENTS = {
  first_pet: {
    id: 'first_pet',
    name: 'First Companion',
    description: 'Create your first pet',
    icon: '🐾',
    reward: { tokens: 50 }
  },
  streak_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    reward: { tokens: 100 }
  },
  level_10: {
    id: 'level_10',
    name: 'Legendary Trainer',
    description: 'Reach level 10 with a pet',
    icon: '👑',
    reward: { tokens: 500 }
  },
  garden_master: {
    id: 'garden_master',
    name: 'Garden Master',
    description: 'Complete 50 garden activities',
    icon: '🌿',
    reward: { tokens: 300 }
  },
  meditation_zen: {
    id: 'meditation_zen',
    name: 'Zen Master',
    description: 'Complete 30 meditation sessions',
    icon: '🧘',
    reward: { tokens: 250 }
  }
}

// Inventory item types
export const ITEM_TYPES = {
  food: {
    name: 'Food',
    category: 'consumable',
    icon: '🍎'
  },
  toy: {
    name: 'Toy',
    category: 'equipment',
    icon: '🎾'
  },
  accessory: {
    name: 'Accessory',
    category: 'cosmetic',
    icon: '👒'
  },
  potion: {
    name: 'Potion',
    category: 'consumable',
    icon: '🧪'
  }
}

// Default inventory items
export const DEFAULT_ITEMS = [
  {
    id: 'basic_food',
    name: 'Basic Food',
    type: 'food',
    description: 'Simple nourishment for your pet',
    effect: { energy: 10, happiness: 5 },
    quantity: 5,
    rarity: 'common'
  },
  {
    id: 'ball',
    name: 'Play Ball',
    type: 'toy',
    description: 'A fun toy for playtime',
    effect: { happiness: 15 },
    quantity: 1,
    rarity: 'common'
  }
]

// Game messages and tooltips
export const GAME_MESSAGES = {
  lowEnergy: 'Your energy is running low. Consider resting or completing rituals.',
  petHungry: 'Your pet is hungry! Feed them to restore their energy.',
  petHappy: 'Your pet is very happy! Keep up the good care.',
  streakLost: 'Your streak has been lost. Start a new one today!',
  levelUp: 'Congratulations! Your pet has reached a new level!',
  achievementUnlocked: 'Achievement Unlocked!',
  dailyReward: 'Daily login reward claimed!'
}

// Tutorial steps
export const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to EtherPets',
    content: 'Discover a unique journey of mindfulness and digital companionship.',
    target: null
  },
  {
    id: 'create_pet',
    title: 'Create Your Pet',
    content: 'Your first step is to create your digital companion that grows with your emotions.',
    target: '#create-pet-button'
  },
  {
    id: 'energy_system',
    title: 'Energy System',
    content: 'Energy is used for activities. Complete rituals to restore it.',
    target: '#energy-bar'
  },
  {
    id: 'daily_rituals',
    title: 'Daily Rituals',
    content: 'Practice mindfulness through daily activities that benefit you and your pet.',
    target: '#daily-rituals'
  },
  {
    id: 'community_garden',
    title: 'Community Garden',
    content: 'Join others in collaborative activities and grow together.',
    target: '#garden-link'
  }
]

export default {
  ENERGY_CONFIG,
  TOKEN_CONFIG,
  PET_LEVELS,
  PET_ACTIVITIES,
  STREAK_REWARDS,
  GARDEN_ACTIVITIES,
  SEASONAL_EVENTS,
  ACHIEVEMENTS,
  ITEM_TYPES,
  DEFAULT_ITEMS,
  GAME_MESSAGES,
  TUTORIAL_STEPS
}
