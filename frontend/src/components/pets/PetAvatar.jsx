import React from 'react'
import { motion } from 'framer-motion'

const PetAvatar = ({ pet, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  }

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'from-yellow-400 to-orange-500',
      calm: 'from-green-400 to-blue-500',
      sad: 'from-blue-400 to-purple-500',
      excited: 'from-pink-500 to-red-500',
      neutral: 'from-gray-400 to-gray-600'
    }
    return colors[mood] || colors.neutral
  }

  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`${sizeClasses[size]} relative`}
    >
      {/* Main orb */}
      <div className={`w-full h-full rounded-full bg-gradient-to-br ${getMoodColor(pet.mood)} shadow-lg flex items-center justify-center`}>
        {/* Inner glow */}
        <div className="w-3/4 h-3/4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {/* Pet face/expression */}
          <div className="text-white text-2xl font-bold">
            {getPetEmoji(pet.mood)}
          </div>
        </div>
      </div>
      
      {/* Floating particles */}
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0"
      >
        {[0, 90, 180, 270].map((rotation) => (
          <motion.div
            key={rotation}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: rotation / 90
            }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
            style={{
              transform: `rotate(${rotation}deg) translateX(40px) rotate(-${rotation}deg)`
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

const getPetEmoji = (mood) => {
  const emojis = {
    happy: '😊',
    calm: '😌',
    sad: '😔',
    excited: '🤩',
    neutral: '😐'
  }
  return emojis[mood] || emojis.neutral
}

export default PetAvatar