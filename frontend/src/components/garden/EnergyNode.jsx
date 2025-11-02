import React from 'react'
import { motion } from 'framer-motion'
import { Puzzle, Heart, Users, Zap, CheckCircle, Lock } from 'lucide-react'

const EnergyNode = ({ node, onClick }) => {
  const getNodeIcon = (type) => {
    switch (type) {
      case 'puzzle':
        return <Puzzle className="w-6 h-6" />
      case 'reflection':
        return <Heart className="w-6 h-6" />
      case 'social':
        return <Users className="w-6 h-6" />
      case 'meditation':
        return <Zap className="w-6 h-6" />
      default:
        return <Puzzle className="w-6 h-6" />
    }
  }

  const getNodeColor = (type) => {
    switch (type) {
      case 'puzzle':
        return 'from-purple-500 to-pink-500'
      case 'reflection':
        return 'from-blue-500 to-cyan-500'
      case 'social':
        return 'from-green-500 to-emerald-500'
      case 'meditation':
        return 'from-orange-500 to-yellow-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getNodeLabel = (type) => {
    switch (type) {
      case 'puzzle':
        return 'Puzzle'
      case 'reflection':
        return 'Reflect'
      case 'social':
        return 'Social'
      case 'meditation':
        return 'Meditate'
      default:
        return 'Activity'
    }
  }

  return (
    <motion.button
      whileHover={{ scale: node.solved ? 1 : 1.05 }}
      whileTap={{ scale: node.solved ? 1 : 0.95 }}
      onClick={onClick}
      disabled={node.solved}
      className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center p-4 relative transition-all duration-300 ${
        node.solved
          ? 'bg-white/10 border-2 border-accent-mint cursor-default'
          : 'bg-white/5 border-2 border-white/10 hover:border-white/30 cursor-pointer'
      }`}
    >
      {/* Energy Cost */}
      {!node.solved && (
        <div className="absolute -top-2 -right-2 bg-accent-cyan text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {node.energy}
        </div>
      )}

      {/* Icon */}
      <div className={`mb-2 ${
        node.solved ? 'text-accent-mint' : 'text-white'
      }`}>
        {node.solved ? (
          <CheckCircle className="w-8 h-8" />
        ) : (
          getNodeIcon(node.type)
        )}
      </div>

      {/* Label */}
      <div className={`text-sm font-medium ${
        node.solved ? 'text-accent-mint' : 'text-white'
      }`}>
        {getNodeLabel(node.type)}
      </div>

      {/* Status */}
      {node.solved && (
        <div className="absolute -bottom-2 text-xs bg-accent-mint text-primary font-bold px-2 py-1 rounded-full">
          Solved
        </div>
      )}

      {/* Hover Effect */}
      {!node.solved && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0"
          whileHover={{ opacity: 1 }}
        />
      )}
    </motion.button>
  )
}

export default EnergyNode