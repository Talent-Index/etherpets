import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Calendar } from 'lucide-react'
import { useGameState } from '../../context/GameStateContext'

const StreakCounter = () => {
  const { gameState } = useGameState()
  const { streak, lastPlayed } = gameState

  const isToday = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const hasPlayedToday = isToday(lastPlayed)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-morphism p-4 rounded-xl flex items-center space-x-3"
    >
      <div className="relative">
        <Flame className={`w-8 h-8 ${hasPlayedToday ? 'text-orange-400' : 'text-gray-400'}`} />
        {hasPlayedToday && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 text-orange-400"
            style={{ filter: 'blur(8px)' }}
          >
            <Flame className="w-8 h-8" />
          </motion.div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-accent-mint">{streak}</div>
        <div className="text-xs text-gray-400">Day Streak</div>
      </div>
      <div className="flex-1 text-right">
        <div className="text-sm text-gray-400 flex items-center justify-end space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{hasPlayedToday ? 'Today' : 'Missed'}</span>
        </div>
        <div className="text-xs text-gray-500">
          {hasPlayedToday ? 'Completed!' : 'Play to maintain streak'}
        </div>
      </div>
    </motion.div>
  )
}

export default StreakCounter