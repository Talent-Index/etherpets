import React from 'react'
import { motion } from 'framer-motion'
import { Smile, Meh, Frown, Laugh, Heart } from 'lucide-react'

const MoodIndicator = ({ mood, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const moodConfig = {
    happy: {
      icon: <Laugh className="w-full h-full" />,
      color: 'text-mood-happy',
      bg: 'bg-mood-happy/20',
      border: 'border-mood-happy'
    },
    calm: {
      icon: <Heart className="w-full h-full" />,
      color: 'text-mood-calm',
      bg: 'bg-mood-calm/20',
      border: 'border-mood-calm'
    },
    neutral: {
      icon: <Meh className="w-full h-full" />,
      color: 'text-gray-400',
      bg: 'bg-gray-400/20',
      border: 'border-gray-400'
    },
    sad: {
      icon: <Frown className="w-full h-full" />,
      color: 'text-mood-sad',
      bg: 'bg-mood-sad/20',
      border: 'border-mood-sad'
    },
    excited: {
      icon: <Smile className="w-full h-full" />,
      color: 'text-mood-excited',
      bg: 'bg-mood-excited/20',
      border: 'border-mood-excited'
    }
  }

  const config = moodConfig[mood] || moodConfig.neutral

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`${sizeClasses[size]} ${config.bg} ${config.border} border-2 rounded-full flex items-center justify-center ${config.color}`}
    >
      {config.icon}
    </motion.div>
  )
}

export default MoodIndicator