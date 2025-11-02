import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Battery, BatteryCharging } from 'lucide-react'

const EnergyBar = ({ energy = 75, showIcon = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-5'
  }

  const getEnergyColor = (energyLevel) => {
    if (energyLevel >= 80) return 'from-green-400 to-emerald-400'
    if (energyLevel >= 60) return 'from-yellow-400 to-amber-400'
    if (energyLevel >= 40) return 'from-orange-400 to-red-400'
    if (energyLevel >= 20) return 'from-red-400 to-pink-400'
    return 'from-gray-400 to-gray-600'
  }

  const getEnergyIcon = (energyLevel) => {
    if (energyLevel >= 80) return <BatteryCharging className="w-4 h-4 text-green-400" />
    if (energyLevel >= 60) return <Battery className="w-4 h-4 text-yellow-400" />
    if (energyLevel >= 40) return <Battery className="w-4 h-4 text-orange-400" />
    if (energyLevel >= 20) return <Battery className="w-4 h-4 text-red-400" />
    return <Zap className="w-4 h-4 text-gray-400" />
  }

  return (
    <div className="flex items-center space-x-3">
      {showIcon && getEnergyIcon(energy)}
      
      <div className="flex-1">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Energy</span>
          <span>{energy}%</span>
        </div>
        
        <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${energy}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full bg-gradient-to-r ${getEnergyColor(energy)} rounded-full relative`}
          >
            {/* Animated sparkles for high energy */}
            {energy > 70 && (
              <motion.div
                animate={{ 
                  x: ['0%', '100%', '0%'],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="absolute top-0 left-0 w-4 h-full bg-white/30 blur-sm"
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EnergyBar