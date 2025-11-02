import React from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { useWallet } from '../context/WalletContext'
import PetCard from '../components/pets/PetCard'
import RitualCard from '../components/rituals/RitualCard'
import { Heart, Zap, Users, Star } from 'lucide-react'

const Dashboard = () => {
  const { currentPet, user } = useUser()
  const { account } = useWallet()

  const rituals = [
    {
      id: 1,
      title: "Morning Breathing",
      description: "Start your day with calm energy",
      duration: "5 min",
      type: "breathing",
      completed: true
    },
    {
      id: 2,
      title: "Gratitude Reflection",
      description: "Write three things you're grateful for",
      duration: "3 min",
      type: "reflection",
      completed: false
    },
    {
      id: 3,
      title: "Garden Sync",
      description: "Join others in the community garden",
      duration: "10 min",
      type: "social",
      completed: false
    }
  ]

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
    <div className="max-w-6xl mx-auto">
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
        {/* Left Column - Pet Card */}
        <div className="lg:col-span-2">
          <PetCard pet={currentPet} />
        </div>

        {/* Right Column - Stats & Rituals */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Today's Energy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span>Happiness</span>
                </div>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-mood-happy rounded-full h-2 transition-all duration-500"
                    style={{ width: `${currentPet.happiness}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span>Energy</span>
                </div>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-accent-cyan rounded-full h-2 transition-all duration-500"
                    style={{ width: `${currentPet.energy}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Social</span>
                </div>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-accent-lavender rounded-full h-2 transition-all duration-500"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Daily Rituals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Daily Rituals</h3>
            <div className="space-y-3">
              {rituals.map((ritual) => (
                <RitualCard key={ritual.id} ritual={ritual} />
              ))}
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-morphism p-6 rounded-xl text-center"
          >
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent-mint">7</div>
            <div className="text-gray-400">Day Streak</div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard