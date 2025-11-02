import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock, Zap } from 'lucide-react'

const RitualCard = ({ ritual, onStart }) => {
  const getRitualIcon = (type) => {
    switch (type) {
      case 'breathing':
        return '🫁'
      case 'reflection':
        return '📝'
      case 'social':
        return '👥'
      case 'movement':
        return '💃'
      default:
        return '✨'
    }
  }

  const getRitualColor = (type) => {
    switch (type) {
      case 'breathing':
        return 'from-blue-500 to-cyan-500'
      case 'reflection':
        return 'from-purple-500 to-pink-500'
      case 'social':
        return 'from-green-500 to-emerald-500'
      case 'movement':
        return 'from-orange-500 to-red-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`glass-morphism p-4 rounded-xl border-l-4 ${
        ritual.completed ? 'border-accent-mint' : 'border-white/20'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getRitualColor(ritual.type)} flex items-center justify-center text-white text-xl`}>
            {getRitualIcon(ritual.type)}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h4 className={`font-semibold ${ritual.completed ? 'text-gray-400' : 'text-white'}`}>
              {ritual.title}
            </h4>
            <p className="text-sm text-gray-400">{ritual.description}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{ritual.duration}</span>
              </div>
              {ritual.energyReward && (
                <div className="flex items-center space-x-1 text-xs text-accent-cyan">
                  <Zap className="w-3 h-3" />
                  <span>+{ritual.energyReward} energy</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center space-x-3">
          {ritual.completed ? (
            <CheckCircle className="w-6 h-6 text-accent-mint" />
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStart?.(ritual)}
              className="bg-accent-teal hover:bg-accent-mint text-primary font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>Start</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default RitualCard