import React from 'react'
import { motion } from 'framer-motion'
import PetAvatar from './PetAvatar'
import MoodIndicator from './MoodIndicator'
import { useUser } from '../../context/UserContext'
import { Heart, Zap, Utensils, Moon } from 'lucide-react'

const PetCard = ({ pet }) => {
  const { performPetAction } = useUser()

  const actions = [
    { icon: <Utensils className="w-5 h-5" />, label: 'Feed', type: 'feed' },
    { icon: <Heart className="w-5 h-5" />, label: 'Play', type: 'play' },
    { icon: <Moon className="w-5 h-5" />, label: 'Rest', type: 'rest' },
    { icon: <Zap className="w-5 h-5" />, label: 'Meditate', type: 'meditate' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-morphism p-8 rounded-2xl"
    >
      {/* Pet Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{pet.name}</h2>
          <p className="text-gray-400">Level {pet.level} • {pet.type}</p>
        </div>
        <MoodIndicator mood={pet.mood} size="lg" />
      </div>

      {/* Pet Avatar */}
      <div className="flex justify-center mb-8">
        <PetAvatar pet={pet} size="xl" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <Zap className="w-6 h-6 text-accent-cyan mx-auto mb-2" />
          <div className="text-lg font-semibold">{pet.energy}/100</div>
          <div className="text-sm text-gray-400">Energy</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <div className="text-lg font-semibold">{pet.happiness}/100</div>
          <div className="text-sm text-gray-400">Happiness</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => performPetAction(pet.id, action.type)}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 transition-all duration-300 flex flex-col items-center space-y-2"
          >
            <div className="text-accent-mint">
              {action.icon}
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Mood Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-white/5 rounded-xl border-l-4 border-accent-mint"
      >
        <p className="text-sm text-gray-300">
          {getMoodMessage(pet.mood, pet.name)}
        </p>
      </motion.div>
    </motion.div>
  )
}

const getMoodMessage = (mood, name) => {
  const messages = {
    happy: `${name} is glowing with happiness today! Your positive energy is shining through.`,
    calm: `${name} feels peaceful and centered. Your calm presence is nurturing.`,
    sad: `${name} seems a bit down today. Maybe some gentle care would help?`,
    excited: `${name} is buzzing with excitement! Your energy is contagious.`,
    neutral: `${name} is content and observant. Ready for whatever the day brings.`
  }
  return messages[mood] || messages.neutral
}

export default PetCard