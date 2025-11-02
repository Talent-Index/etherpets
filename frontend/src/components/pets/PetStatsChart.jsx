import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Heart, Zap, Brain, Star } from 'lucide-react'

const PetStatsChart = ({ pet, timeframe = 'week' }) => {
  const statsData = {
    week: [
      { day: 'Mon', energy: 85, happiness: 78, focus: 72 },
      { day: 'Tue', energy: 78, happiness: 82, focus: 75 },
      { day: 'Wed', energy: 92, happiness: 88, focus: 80 },
      { day: 'Thu', energy: 65, happiness: 70, focus: 68 },
      { day: 'Fri', energy: 88, happiness: 85, focus: 78 },
      { day: 'Sat', energy: 95, happiness: 92, focus: 85 },
      { day: 'Sun', energy: 82, happiness: 80, focus: 76 }
    ],
    month: [
      { week: 'W1', energy: 80, happiness: 75, focus: 70 },
      { week: 'W2', energy: 85, happiness: 82, focus: 78 },
      { week: 'W3', energy: 78, happiness: 80, focus: 75 },
      { week: 'W4', energy: 90, happiness: 88, focus: 82 }
    ]
  }

  const data = statsData[timeframe]
  const maxValue = 100
  const isWeekly = timeframe === 'week'

  const getStatColor = (stat) => {
    switch (stat) {
      case 'energy': return 'from-yellow-400 to-amber-400'
      case 'happiness': return 'from-pink-400 to-rose-400'
      case 'focus': return 'from-blue-400 to-cyan-400'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getStatIcon = (stat) => {
    switch (stat) {
      case 'energy': return <Zap className="w-4 h-4" />
      case 'happiness': return <Heart className="w-4 h-4" />
      case 'focus': return <Brain className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-accent-cyan" />
          <span>Stats Overview</span>
        </h3>
        
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
              timeframe === 'week' 
                ? 'bg-accent-teal text-primary' 
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
              timeframe === 'month' 
                ? 'bg-accent-teal text-primary' 
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-6">
        {/* Stats Legend */}
        <div className="flex justify-center space-x-6">
          {['energy', 'happiness', 'focus'].map((stat) => (
            <div key={stat} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatColor(stat)}`} />
              <span className="text-sm text-gray-400 capitalize">{stat}</span>
            </div>
          ))}
        </div>

        {/* Chart Bars */}
        <div className="flex items-end justify-between h-40 space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              {/* Bars Container */}
              <div className="flex items-end justify-center space-x-1 w-full h-32">
                {['energy', 'happiness', 'focus'].map((stat) => (
                  <motion.div
                    key={stat}
                    initial={{ height: 0 }}
                    animate={{ height: `${(item[stat] / maxValue) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`w-3 rounded-t-lg bg-gradient-to-t ${getStatColor(stat)} relative group`}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {stat}: {item[stat]}%
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* X-axis Label */}
              <div className="text-xs text-gray-400 font-medium">
                {isWeekly ? item.day : item.week}
              </div>
            </div>
          ))}
        </div>

        {/* Current Stats Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          {['energy', 'happiness', 'focus'].map((stat) => {
            const currentValue = pet?.[stat] || 75
            return (
              <motion.div
                key={stat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center p-3 rounded-lg bg-white/5"
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {getStatIcon(stat)}
                  <span className="text-sm font-semibold capitalize">{stat}</span>
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${getStatColor(stat)} bg-clip-text text-transparent`}>
                  {currentValue}%
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-accent-teal/10 border border-accent-teal/20 rounded-xl"
      >
        <p className="text-sm text-accent-teal text-center">
          📈 Your pet's {pet?.name} energy peaks on weekends! Try more activities during weekdays.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default PetStatsChart