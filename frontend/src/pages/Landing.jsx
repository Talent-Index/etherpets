import React from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '../context/WalletContext'
import { useUser } from '../context/UserContext'
import { Sparkles, Heart, Users, Zap } from 'lucide-react'

const Landing = () => {
  const { connectWallet, isConnected, isConnecting } = useWallet()
  const { user, currentPet } = useUser()

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Emotional Companion",
      description: "Your pet reflects your mood and grows with your emotional wellness"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "On-Chain Memories",
      description: "Every milestone is recorded on Avalanche blockchain forever"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Gardens",
      description: "Join others in collaborative puzzles and healing rituals"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Mindful Gaming",
      description: "Designed to refresh your mind, not drain your energy"
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-display mb-6 text-accent-cyan">
            EtherPets
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Where your emotions grow magical companions. 
            A healing journey on the blockchain.
          </p>
          
          {!isConnected ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              disabled={isConnecting}
              className="btn-primary text-lg px-8 py-4"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet to Begin'}
            </motion.button>
          ) : !currentPet ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              Create Your SoulPet
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              Enter Your Garden
            </motion.button>
          )}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="glass-morphism p-6 rounded-xl text-center"
            >
              <div className="text-accent-mint mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="glass-morphism p-8 rounded-2xl"
        >
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-accent-mint">1,234</div>
              <div className="text-gray-400">Active Pets</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-lavender">567</div>
              <div className="text-gray-400">Gardens Blooming</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-cyan">89%</div>
              <div className="text-gray-400">Players Feel Calmer</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Landing