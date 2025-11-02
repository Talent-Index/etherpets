export const MOODS = {
  happy: {
    label: 'Happy',
    emoji: '😊',
    color: '#FFD700',
    bgColor: 'rgba(255, 215, 0, 0.2)',
    description: 'Feeling joyful and positive'
  },
  calm: {
    label: 'Calm',
    emoji: '😌',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.2)',
    description: 'Peaceful and centered'
  },
  neutral: {
    label: 'Neutral',
    emoji: '😐',
    color: '#9CA3AF',
    bgColor: 'rgba(156, 163, 175, 0.2)',
    description: 'Balanced and observant'
  },
  sad: {
    label: 'Sad',
    emoji: '😔',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.2)',
    description: 'Feeling down or reflective'
  },
  excited: {
    label: 'Excited',
    emoji: '🤩',
    color: '#F87171',
    bgColor: 'rgba(248, 113, 113, 0.2)',
    description: 'Energetic and enthusiastic'
  }
}

export const PET_TYPES = [
  {
    id: 'spirit_fox',
    name: 'Spirit Fox',
    description: 'Wise and mystical companion',
    baseColor: '#FF6B6B',
    abilities: ['Intuition', 'Wisdom', 'Protection']
  },
  {
    id: 'moon_rabbit',
    name: 'Moon Rabbit',
    description: 'Gentle and nurturing friend',
    baseColor: '#A78BFA',
    abilities: ['Healing', 'Comfort', 'Dreams']
  },
  {
    id: 'star_cat',
    name: 'Star Cat',
    description: 'Playful and curious explorer',
    baseColor: '#FBBF24',
    abilities: ['Curiosity', 'Agility', 'Luck']
  },
  {
    id: 'crystal_dragon',
    name: 'Crystal Dragon',
    description: 'Ancient and powerful guardian',
    baseColor: '#06B6D4',
    abilities: ['Strength', 'Magic', 'Guidance']
  }
]

export const RITUAL_TYPES = {
  breathing: {
    name: 'Breathing Exercise',
    duration: 300, // 5 minutes in seconds
    energyReward: 5,
    description: 'Calm your mind with rhythmic breathing'
  },
  meditation: {
    name: 'Meditation',
    duration: 600, // 10 minutes
    energyReward: 10,
    description: 'Find inner peace through mindfulness'
  },
  reflection: {
    name: 'Daily Reflection',
    duration: 180, // 3 minutes
    energyReward: 8,
    description: 'Journal your thoughts and feelings'
  },
  movement: {
    name: 'Gentle Movement',
    duration: 480, // 8 minutes
    energyReward: 7,
    description: 'Connect with your body through motion'
  }
}

export const GARDEN_NODE_TYPES = {
  puzzle: {
    name: 'Puzzle Challenge',
    color: 'from-purple-500 to-pink-500',
    energyCost: 3,
    description: 'Solve collaborative puzzles'
  },
  reflection: {
    name: 'Reflection Space',
    color: 'from-blue-500 to-cyan-500',
    energyCost: 2,
    description: 'Share thoughts with the community'
  },
  social: {
    name: 'Social Connection',
    color: 'from-green-500 to-emerald-500',
    energyCost: 4,
    description: 'Connect with other players'
  },
  meditation: {
    name: 'Group Meditation',
    color: 'from-orange-500 to-yellow-500',
    energyCost: 2,
    description: 'Meditate together in harmony'
  }
}