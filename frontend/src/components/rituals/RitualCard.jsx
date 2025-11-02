/**
 * Daily Rituals Component
 * Displays and manages daily mindfulness activities for users
 */
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock, Zap, Calendar } from 'lucide-react'
import { useGameState } from '../../context/GameStateContext'

const DailyRituals = () => {
  const { gameState, completeRitual } = useGameState()
  const { dailyRituals } = gameState

  // Daily rituals configuration
  const rituals = [
    {
      id: 'breathing',
      name: 'Morning Breathing',
      description: '5-minute breathing exercise to start your day',
      duration: '5 min',
      icon: '🌬️',
      color: 'from-blue-400 to-cyan-400',
      energyReward: 5,
      timeOfDay: 'morning'
    },
    {
      id: 'reflection',
      name: 'Daily Reflection',
      description: 'Journal your thoughts and gratitude',
      duration: '3 min',
      icon: '📝',
      color: 'from-purple-400 to-pink-400',
      energyReward: 8,
      timeOfDay: 'afternoon'
    },
    {
      id: 'social',
      name: 'Community Connection',
      description: 'Visit the garden and connect with others',
      duration: '10 min',
      icon: '👥',
      color: 'from-green-400 to-emerald-400',
      energyReward: 10,
      timeOfDay: 'evening'
    }
  ]

  const [activeRitual, setActiveRitual] = useState(null)

  /**
   * Handle ritual completion
   * @param {string} ritualId - ID of the completed ritual
   */
  const handleCompleteRitual = (ritualId) => {
    completeRitual(ritualId)
    setActiveRitual(null)
  }

  /**
   * Get completion percentage for all rituals
   * @returns {number} Percentage of completed rituals
   */
  const getCompletionPercentage = () => {
    const completed = Object.values(dailyRituals).filter(ritual => ritual.completed).length
    return Math.round((completed / rituals.length) * 100)
  }

  /**
   * Check if all rituals are completed
   * @returns {boolean} All rituals completed status
   */
  const areAllRitualsCompleted = () => {
    return Object.values(dailyRituals).every(ritual => ritual.completed)
  }

  const completionPercentage = getCompletionPercentage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-accent-cyan" />
            <div>
              <h3 className="font-semibold">Daily Rituals</h3>
              <p className="text-gray-400 text-sm">Complete for rewards</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-accent-mint">
              {completionPercentage}%
            </div>
            <div className="text-xs text-gray-400">complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-2 bg-gradient-to-r from-accent-cyan to-accent-teal rounded-full"
          />
        </div>
      </div>

      {/* Rituals List */}
      <div className="p-4 space-y-3">
        {rituals.map((ritual, index) => {
          const ritualState = dailyRituals[ritual.id]
          const isCompleted = ritualState?.completed

          return (
            <motion.div
              key={ritual.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                isCompleted
                  ? 'bg-accent-teal/20 border-accent-teal'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer'
              }`}
              onClick={() => !isCompleted && setActiveRitual(ritual)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Ritual Icon */}
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${ritual.color} flex items-center justify-center text-lg`}>
                    {ritual.icon}
                  </div>

                  {/* Ritual Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-semibold text-sm ${
                        isCompleted ? 'text-gray-400' : 'text-white'
                      }`}>
                        {ritual.name}
                      </h4>
                      {isCompleted && (
                        <CheckCircle className="w-4 h-4 text-accent-mint" />
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">{ritual.description}</p>
                    
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{ritual.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-yellow-400">
                        <Zap className="w-3 h-3" />
                        <span>+{ritual.energyReward} energy</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time of Day Badge */}
                {!isCompleted && (
                  <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-400 capitalize">
                    {ritual.timeOfDay}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Completion Reward */}
      {areAllRitualsCompleted() && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 border-t border-white/10 bg-accent-mint/10"
        >
          <div className="text-center">
            <div className="text-accent-mint font-semibold text-sm mb-1">
              🎉 All rituals completed!
            </div>
            <div className="text-xs text-gray-400">
              Bonus: +50 tokens and pet happiness boost
            </div>
          </div>
        </motion.div>
      )}

      {/* Ritual Start Modal */}
      {activeRitual && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeRitual.color} flex items-center justify-center text-2xl mx-auto mb-4`}>
                {activeRitual.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{activeRitual.name}</h3>
              <p className="text-gray-400 text-sm">{activeRitual.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">{activeRitual.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Energy Reward</span>
                <span className="text-accent-mint">+{activeRitual.energyReward}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pet Happiness</span>
                <span className="text-accent-mint">+15%</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setActiveRitual(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
              >
                Maybe Later
              </button>
              <button
                onClick={() => handleCompleteRitual(activeRitual.id)}
                className="flex-1 btn-primary"
              >
                Start Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default DailyRituals