import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { useWallet } from '../context/WalletContext'
import PetCard from '../components/pets/PetCard'
import PetCareActions from '../components/pets/PetCareActions'
import PetStatsChart from '../components/pets/PetStatsChart'
import DailyRituals from '../components/rituals/DailyRituals'
import GuidedMeditation from '../components/rituals/GuidedMeditation'
import StreakCounter from '../components/common/StreakCounter'
import EnergyBar from '../components/common/EnergyBar'
import SeasonalEvents from '../components/garden/SeasonalEvents'
import Confetti from '../components/common/Confetti'
import { Heart, Zap, Users, Star, TrendingUp, Calendar } from 'lucide-react'

const Dashboard = () => {
  const { currentPet, performPetAction } = useUser()
  const { account } = useWallet()
  const [showMeditation, setShowMeditation] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handlePetAction = async (actionType, cost) => {
    if (!currentPet) return
    const success = await performPetAction(currentPet.id, actionType)
    
    if (success && actionType === 'meditate') {
      setShowMeditation(true)
    }
  }

  const handleMeditationComplete = () => {
    setShowMeditation(false)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  if (!currentPet) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">No Pet Found</h2>
        <p className="text-gray-400 mb-8">Create your first SoulPet to begin your journey</p>
        <button className="btn-primary">Create SoulPet</button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Confetti isActive={showConfetti} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Your Sanctuary</h1>
        <p className="text-gray-400">
          Welcome back! Your {currentPet.name} is waiting for you.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Pet & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <PetCard pet={currentPet} />
          
          {/* Quick Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-accent-mint">{currentPet.energy}%</div>
                <div className="text-sm text-gray-400">Energy</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-accent-mint">{currentPet.happiness}%</div>
                <div className="text-sm text-gray-400">Happiness</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-accent-mint">Level {currentPet.level}</div>
                <div className="text-sm text-gray-400">Growth</div>
              </div>
            </div>
          </motion.div>

          {/* Pet Care Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Care for {currentPet.name}</h3>
            <PetCareActions 
              onAction={handlePetAction}
              energy={currentPet.energy}
              happiness={currentPet.happiness}
            />
          </motion.div>

          {/* Stats Chart */}
          <PetStatsChart pet={currentPet} />
        </div>

        {/* Right Column - Rituals & Events */}
        <div className="space-y-6">
          <StreakCounter />
          <DailyRituals />
          
          {/* Seasonal Events */}
          <SeasonalEvents />

          {/* Guided Meditation */}
          {showMeditation ? (
            <GuidedMeditation onComplete={handleMeditationComplete} />
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-morphism p-6 rounded-xl text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧘</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Guided Meditation</h3>
              <p className="text-gray-400 text-sm mb-4">
                5-minute session to calm your mind and boost pet happiness
              </p>
              <button
                onClick={() => setShowMeditation(true)}
                className="btn-primary w-full"
              >
                Start Meditation
              </button>
            </motion.div>
          )}

          {/* Energy Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Energy Management</span>
            </h3>
            <EnergyBar energy={currentPet.energy} size="lg" />
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Daily Regen</span>
                <span className="text-accent-mint">+25% in 4h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Activities Today</span>
                <span className="text-accent-mint">3/5</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard