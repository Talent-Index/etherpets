import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import GardenGrid from '../components/garden/GardenGrid'
import GardenChat from '../components/garden/GardenChat'
import { Users, Sprout, Zap, Heart } from 'lucide-react'

const Garden = () => {
  const { currentPet } = useUser()
  const [activeTab, setActiveTab] = useState('garden')

  const gardenStats = {
    members: 12,
    energy: 85,
    harmony: 72,
    blooms: 8
  }

  if (!currentPet) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">No Pet Found</h2>
        <p className="text-gray-400 mb-8">Create your SoulPet to join a garden</p>
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
        <h1 className="text-4xl font-bold mb-2">Community Garden</h1>
        <p className="text-gray-400">
          Connect with other players and grow together in harmony
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Left Column - Stats & Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Garden Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Garden Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-accent-lavender" />
                  <span>Members</span>
                </div>
                <span className="font-semibold">{gardenStats.members}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-accent-cyan" />
                  <span>Energy</span>
                </div>
                <span className="font-semibold">{gardenStats.energy}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span>Harmony</span>
                </div>
                <span className="font-semibold">{gardenStats.harmony}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sprout className="w-5 h-5 text-accent-mint" />
                  <span>Blooms</span>
                </div>
                <span className="font-semibold">{gardenStats.blooms}</span>
              </div>
            </div>
          </motion.div>

          {/* Active Members */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Active Now</h3>
            <div className="space-y-3">
              {['Luna', 'Stella', 'Orion', 'Nova', 'Cosmo'].map((name, index) => (
                <div key={name} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{name}</div>
                    <div className="text-xs text-gray-400">Gardening</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-morphism p-2 rounded-xl mb-6"
          >
            <div className="flex space-x-2">
              {[
                { id: 'garden', label: 'Garden', icon: Sprout },
                { id: 'chat', label: 'Chat', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 flex-1 justify-center ${
                      activeTab === tab.id
                        ? 'bg-accent-teal text-primary'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'garden' ? (
              <GardenGrid />
            ) : (
              <GardenChat />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Garden