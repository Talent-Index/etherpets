import React from 'react'
import { motion } from 'framer-motion'
import { Star, Zap, Heart, Award } from 'lucide-react'

const PetEvolution = ({ pet, experience }) => {
  const currentLevel = pet?.level || 1
  const currentExp = experience || 0
  const expForNextLevel = currentLevel * 100
  const progress = (currentExp / expForNextLevel) * 100

  const levels = [
    { level: 1, name: 'Spirit Seed', requirement: 0, reward: 'Basic Care' },
    { level: 2, name: 'Growing Sprout', requirement: 100, reward: 'Mood Changes' },
    { level: 3, name: 'Young Companion', requirement: 200, reward: 'Energy Actions' },
    { level: 4, name: 'Wise Guardian', requirement: 400, reward: 'Special Abilities' },
    { level: 5, name: 'Elder Spirit', requirement: 800, reward: 'Aura Effects' }
  ]

  const nextLevel = levels.find(l => l.level === currentLevel + 1)
  const currentLevelInfo = levels.find(l => l.level === currentLevel)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-6 rounded-xl"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Award className="w-5 h-5 text-yellow-400" />
        <span>Evolution Progress</span>
      </h3>

      {/* Current Level */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-accent-mint mb-2">Level {currentLevel}</div>
        <div className="text-gray-400">{currentLevelInfo?.name}</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Experience</span>
          <span>{currentExp}/{expForNextLevel} XP</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-3 bg-gradient-to-r from-accent-cyan to-accent-mint rounded-full relative"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-accent-mint rounded-full border-2 border-white"
            />
          </motion.div>
        </div>
      </div>

      {/* Next Level Info */}
      {nextLevel && (
        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Next Level: {nextLevel.name}</span>
          </h4>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Requirement: {nextLevel.requirement} XP</div>
            <div>Reward: {nextLevel.reward}</div>
          </div>
        </div>
      )}

      {/* Level Benefits */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Level Benefits</h4>
        {levels.map((level) => (
          <div
            key={level.level}
            className={`flex items-center space-x-3 p-2 rounded-lg text-sm ${
              level.level <= currentLevel
                ? 'bg-accent-teal/20 text-accent-teal'
                : 'bg-white/5 text-gray-400'
            }`}
          >
            {level.level <= currentLevel ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
            <span>Lvl {level.level}: {level.reward}</span>
          </div>
        ))}
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 p-3 bg-accent-teal/10 border border-accent-teal/20 rounded-lg"
      >
        <p className="text-sm text-accent-teal text-center">
          💫 Care for your pet daily to earn experience and unlock new abilities!
        </p>
      </motion.div>
    </motion.div>
  )
}

// We need to create a CheckCircle and Circle icon component if not available
const CheckCircle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
)

const Circle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
)

export default PetEvolution