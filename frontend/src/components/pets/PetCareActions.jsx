/**
 * Pet Care Actions Component
 * Provides interactive buttons for caring for the user's pet
 */
import React from 'react'
import { motion } from 'framer-motion'
import { Utensils, Heart, Moon, Zap, Battery, Smile } from 'lucide-react'

const PetCareActions = ({ onAction, energy, happiness }) => {
  /**
   * Pet care actions configuration
   */
  const actions = [
    {
      id: 'feed',
      label: 'Feed',
      icon: <Utensils className="w-5 h-5" />,
      description: 'Restores energy and happiness',
      cost: 0,
      energyEffect: '+20',
      happinessEffect: '+10',
      color: 'from-green-400 to-emerald-400',
      disabled: false
    },
    {
      id: 'play',
      label: 'Play',
      icon: <Heart className="w-5 h-5" />,
      description: 'Boosts happiness, uses energy',
      cost: 10,
      energyEffect: '-10',
      happinessEffect: '+20',
      color: 'from-pink-400 to-rose-400',
      disabled: energy < 10
    },
    {
      id: 'rest',
      label: 'Rest',
      icon: <Moon className="w-5 h-5" />,
      description: 'Recovers energy, calms mood',
      cost: 0,
      energyEffect: '+30',
      happinessEffect: '+0',
      color: 'from-blue-400 to-cyan-400',
      disabled: false
    },
    {
      id: 'meditate',
      label: 'Meditate',
      icon: <Zap className="w-5 h-5" />,
      description: 'Increases happiness together',
      cost: 5,
      energyEffect: '+0',
      happinessEffect: '+15',
      color: 'from-purple-400 to-indigo-400',
      disabled: energy < 5
    }
  ]

  /**
   * Handle action button click
   * @param {Object} action - The action to perform
   */
  const handleActionClick = (action) => {
    if (action.disabled) return
    onAction?.(action.id, action.cost)
  }

  return (
    <div className="space-y-4">
      {/* Current Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Battery className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Energy</span>
          </div>
          <div className="text-2xl font-bold text-accent-mint">{energy}%</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Smile className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-400">Happiness</span>
          </div>
          <div className="text-2xl font-bold text-accent-mint">{happiness}%</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: action.disabled ? 1 : 1.05 }}
            whileTap={{ scale: action.disabled ? 1 : 0.95 }}
            onClick={() => handleActionClick(action)}
            disabled={action.disabled}
            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center space-y-2 ${
              action.disabled
                ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed'
                : `bg-gradient-to-br ${action.color} border-white/20 text-white hover:shadow-lg cursor-pointer`
            }`}
          >
            {/* Action Icon */}
            <div className={action.disabled ? 'text-gray-500' : 'text-white'}>
              {action.icon}
            </div>

            {/* Action Label */}
            <span className="font-semibold text-sm">{action.label}</span>

            {/* Action Effects */}
            <div className="flex items-center space-x-2 text-xs">
              {action.energyEffect !== '+0' && (
                <span className={action.energyEffect.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                  ⚡{action.energyEffect}
                </span>
              )}
              {action.happinessEffect !== '+0' && (
                <span className="text-pink-400">
                  ❤️{action.happinessEffect}
                </span>
              )}
            </div>

            {/* Cost Indicator */}
            {action.cost > 0 && (
              <div className={`text-xs ${
                action.disabled ? 'text-red-400' : 'text-yellow-400'
              }`}>
                Cost: {action.cost} energy
              </div>
            )}

            {/* Disabled Tooltip */}
            {action.disabled && (
              <div className="text-xs text-red-400 mt-1">
                Not enough energy
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Action Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-3 bg-accent-teal/10 border border-accent-teal/20 rounded-lg"
      >
        <p className="text-xs text-accent-teal text-center">
          💡 Balance feeding and playing to keep your pet happy and energized!
        </p>
      </motion.div>
    </div>
  )
}

export default PetCareActions