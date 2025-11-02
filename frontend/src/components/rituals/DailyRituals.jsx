import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Zap, Heart, Users } from 'lucide-react'
import { useGameState } from '../../context/GameStateContext'

const DailyRituals = () => {
  const { gameState, completeRitual } = useGameState()
  const { dailyRituals } = gameState

  const rituals = [
    {
      id: 'breathing',
      name: 'Morning Breathing',
      description: '5 minutes of calm breathing',
      icon: <Zap className="w-5 h-5" />,
      energy: dailyRituals.breathing.energy,
      completed: dailyRituals.breathing.completed,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'reflection',
      name: 'Daily Reflection',
      description: 'Journal your thoughts',
      icon: <Heart className="w-5 h-5" />,
      energy: dailyRituals.reflection.energy,
      completed: dailyRituals.reflection.completed,
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'social',
      name: 'Social Connection',
      description: 'Connect with garden mates',
      icon: <Users className="w-5 h-5" />,
      energy: dailyRituals.social.energy,
      completed: dailyRituals.social.completed,
      color: 'from-green-400 to-emerald-400'
    }
  ]

  const completedCount = rituals.filter(r => r.completed).length
  const totalEnergy = rituals.reduce((sum, ritual) => sum + (ritual.completed ? ritual.energy : 0), 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Daily Rituals</h3>
        <div className="text-sm text-gray-400">
          {completedCount}/{rituals.length} completed
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Today's Progress</span>
          <span>+{totalEnergy} energy</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / rituals.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-2 bg-gradient-to-r from-accent-cyan to-accent-mint rounded-full"
          />
        </div>
      </div>

      {/* Rituals List */}
      <div className="space-y-3">
        {rituals.map((ritual, index) => (
          <motion.div
            key={ritual.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300 ${
              ritual.completed
                ? 'border-accent-teal bg-accent-teal/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${ritual.color} flex items-center justify-center text-white`}>
                {ritual.icon}
              </div>
              <div>
                <div className="font-medium text-sm">{ritual.name}</div>
                <div className="text-xs text-gray-400">{ritual.description}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-accent-cyan">+{ritual.energy}</div>
                <div className="text-xs text-gray-400">energy</div>
              </div>
              
              {ritual.completed ? (
                <CheckCircle className="w-6 h-6 text-accent-teal" />
              ) : (
                <button
                  onClick={() => completeRitual(ritual.id)}
                  className="w-6 h-6 rounded-full border-2 border-white/20 hover:border-accent-teal hover:bg-accent-teal/20 transition-colors"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Motivation Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 p-3 bg-accent-teal/10 border border-accent-teal/20 rounded-lg"
      >
        <p className="text-sm text-accent-teal text-center">
          {completedCount === rituals.length 
            ? '🎉 Amazing! You completed all daily rituals!'
            : `Complete ${rituals.length - completedCount} more ritual${rituals.length - completedCount > 1 ? 's' : ''} for bonus energy!`
          }
        </p>
      </motion.div>
    </motion.div>
  )
}

export default DailyRituals