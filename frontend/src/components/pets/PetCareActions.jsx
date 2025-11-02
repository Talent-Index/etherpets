import React from 'react'
import { motion } from 'framer-motion'
import { Utensils, Heart, Moon, Zap } from 'lucide-react'

const PetCareActions = ({ onAction, energy, happiness }) => {
  const actions = [
    {
      icon: <Utensils className="w-6 h-6" />,
      label: 'Feed',
      type: 'feed',
      description: 'Restores energy and happiness',
      cost: 0,
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      label: 'Play',
      type: 'play',
      description: 'Increases happiness, uses energy',
      cost: 10,
      color: 'from-pink-400 to-rose-400'
    },
    {
      icon: <Moon className="w-6 h-6" />,
      label: 'Rest',
      type: 'rest',
      description: 'Restores energy, calms mood',
      cost: 0,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Meditate',
      type: 'meditate',
      description: 'Increases happiness, calms mood',
      cost: 5,
      color: 'from-purple-400 to-indigo-400'
    }
  ]

  const handleAction = (actionType, cost) => {
    if (energy < cost) {
      alert('Not enough energy!')
      return
    }
    onAction?.(actionType, cost)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction(action.type, action.cost)}
          disabled={energy < action.cost}
          className={`bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all duration-300 flex flex-col items-center space-y-2 group disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
            {action.icon}
          </div>
          <div className="text-center">
            <div className="font-semibold text-sm">{action.label}</div>
            <div className="text-xs text-gray-400 mt-1">{action.description}</div>
            {action.cost > 0 && (
              <div className="text-xs text-yellow-400 mt-1">-{action.cost} energy</div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  )
}

export default PetCareActions