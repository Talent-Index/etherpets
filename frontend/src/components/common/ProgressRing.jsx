import React from 'react'
import { motion } from 'framer-motion'

const ProgressRing = ({ 
  progress = 75, 
  size = 120, 
  strokeWidth = 8,
  label,
  subtitle,
  color = 'accent-teal'
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const colorClasses = {
    'accent-teal': 'text-accent-teal stroke-accent-teal',
    'accent-cyan': 'text-accent-cyan stroke-accent-cyan',
    'accent-mint': 'text-accent-mint stroke-accent-mint',
    'accent-lavender': 'text-accent-lavender stroke-accent-lavender'
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/10"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className={colorClasses[color]}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <div className={`text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>
            {progress}%
          </div>
        )}
        {subtitle && (
          <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
        )}
      </div>
    </div>
  )
}

export default ProgressRing