/**
 * Streak Counter Component
 * Displays user's daily login streak with motivational messages
 */
import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Calendar, Trophy, Star } from 'lucide-react'
import { useGameState } from '../../context/GameStateContext'

const StreakCounter = () => {
  const { gameState } = useGameState()
  const { streak, lastPlayed } = gameState

  /**
   * Get motivational message based on streak length
   * @param {number} streakCount - Current streak count
   * @returns {Object} Message and icon data
   */
  const getStreakMessage = (streakCount) => {
    if (streakCount >= 30) {
      return {
        message: 'Mindfulness Master! 🎯',
        description: '30+ days of consistent practice',
        icon: <Trophy className="w-6 h-6 text-yellow-400" />,
        color: 'from-yellow-400 to-orange-400'
      }
    } else if (streakCount >= 14) {
      return {
        message: 'Amazing Consistency! 🌟',
        description: 'Two weeks strong!',
        icon: <Star className="w-6 h-6 text-purple-400" />,
        color: 'from-purple-400 to-pink-400'
      }
    } else if (streakCount >= 7) {
      return {
        message: 'Great Start! 💫',
        description: 'One week of mindfulness',
        icon: <Flame className="w-6 h-6 text-orange-400" />,
        color: 'from-orange-400 to-red-400'
      }
    } else {
      return {
        message: 'Building Momentum! 🔥',
        description: 'Keep going!',
        icon: <Flame className="w-6 h-6 text-red-400" />,
        color: 'from-red-400 to-pink-400'
      }
    }
  }

  /**
   * Check if user maintained streak today
   * @returns {boolean} Whether streak is maintained today
   */
  const isStreakMaintained = () => {
    if (!lastPlayed) return false
    const lastPlayedDate = new Date(lastPlayed)
    const today = new Date()
    return lastPlayedDate.toDateString() === today.toDateString()
  }

  const streakData = getStreakMessage(streak)
  const maintained = isStreakMaintained()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-xl overflow-hidden"
    >
      {/* Streak Header */}
      <div className={`bg-gradient-to-r ${streakData.color} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {streakData.icon}
            <div>
              <h3 className="font-semibold">Daily Streak</h3>
              <p className="text-white/80 text-sm">{streakData.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{streak}</div>
            <div className="text-sm opacity-80">days</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Streak Message */}
        <div className="text-center mb-4">
          <p className="font-semibold text-accent-mint">{streakData.message}</p>
        </div>

        {/* Streak Status */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${maintained ? 'bg-green-400' : 'bg-gray-400'}`} />
          <span className="text-sm text-gray-400">
            {maintained ? 'Streak maintained today' : 'Complete a ritual today'}
          </span>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">This week</span>
            <span className="text-accent-mint font-semibold">
              {Math.min(streak % 7 || 7, 7)}/7 days
            </span>
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index < (streak % 7 || streak)
                    ? 'bg-accent-mint'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Next Milestone */}
        {streak < 30 && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-accent-cyan" />
              <span className="text-gray-400">Next milestone: </span>
              <span className="text-accent-mint font-semibold">
                {streak < 7 ? 7 : streak < 14 ? 14 : 30} days
              </span>
            </div>
          </div>
        )}

        {/* Streak Benefits */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Daily bonus</span>
            <span className="text-accent-mint">+{streak * 2} tokens</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Pet happiness</span>
            <span className="text-accent-mint">+{Math.min(streak * 3, 30)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default StreakCounter