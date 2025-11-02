import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Users, Gift, Sparkles } from 'lucide-react'

const SeasonalEvents = () => {
  const [currentEvent, setCurrentEvent] = useState(null)
  const [timeLeft, setTimeLeft] = useState({})

  const events = [
    {
      id: 1,
      name: 'Spring Bloom Festival',
      description: 'Celebrate new beginnings with special garden activities',
      duration: '7 days',
      participants: 234,
      rewards: ['Special Pet Skins', 'Bonus Energy', 'Limited Items'],
      color: 'from-green-400 to-emerald-400',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      active: true
    },
    {
      id: 2,
      name: 'Lunar Harmony',
      description: 'Night-time meditation and moon-themed puzzles',
      duration: '3 days',
      participants: 156,
      rewards: ['Moon Crystals', 'Night Pet Forms'],
      color: 'from-purple-400 to-indigo-400',
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      active: false
    }
  ]

  useEffect(() => {
    const activeEvent = events.find(event => event.active)
    setCurrentEvent(activeEvent)

    const timer = setInterval(() => {
      if (activeEvent) {
        const now = new Date()
        const difference = activeEvent.endDate - now
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!currentEvent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism p-6 rounded-xl text-center"
      >
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Active Events</h3>
        <p className="text-gray-400 text-sm">
          Check back later for special seasonal events and rewards!
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-xl overflow-hidden"
    >
      {/* Event Header */}
      <div className={`bg-gradient-to-r ${currentEvent.color} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-xl font-bold">{currentEvent.name}</h3>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
            Active
          </div>
        </div>
        <p className="text-white/90">{currentEvent.description}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Countdown Timer */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-3">
            <Clock className="w-4 h-4 text-accent-cyan" />
            <span className="text-sm font-semibold text-gray-400">Event Ends In</span>
          </div>
          <div className="flex justify-center space-x-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="bg-white/5 rounded-lg px-3 py-2 min-w-12">
                  <div className="text-xl font-bold text-accent-mint">
                    {value.toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1 capitalize">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-accent-lavender" />
            <div>
              <div className="text-sm text-gray-400">Duration</div>
              <div className="font-semibold">{currentEvent.duration}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-accent-teal" />
            <div>
              <div className="text-sm text-gray-400">Participants</div>
              <div className="font-semibold">{currentEvent.participants}</div>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Gift className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-400">Event Rewards</span>
          </div>
          <div className="space-y-2">
            {currentEvent.rewards.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 bg-white/5 rounded-lg p-3"
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span className="text-sm">{reward}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-accent-cyan to-accent-teal text-primary font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Join Event</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default SeasonalEvents