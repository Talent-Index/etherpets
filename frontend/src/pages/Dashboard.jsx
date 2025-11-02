import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { useWallet } from '../context/WalletContext'
import { useGameState } from '../context/GameStateContext'
import PetCard from '../components/pets/PetCard'
import PetStatsChart from '../components/pets/PetStatsChart'
import AIPetCompanion from '../components/ai/AIPetCompanion'
import VoiceCommands from '../components/voice/VoiceCommands'
import ARPetViewer from '../components/ar/ARPetViewer'
import MiniGames from '../components/garden/MiniGames'
import GuidedMeditation from '../components/rituals/GuidedMeditation'
import SeasonalEvents from '../components/garden/SeasonalEvents'
import EnergyBar from '../components/common/EnergyBar'
import StreakCounter from '../components/common/StreakCounter'
import Confetti from '../components/common/Confetti'
import { 
  Camera, 
  Mic, 
  Brain, 
  Gamepad, 
  Zap, 
  Star,
  Video,
  MessageCircle
} from 'lucide-react'

const Dashboard = () => {
  const { currentPet, updatePetMood, performPetAction } = useUser()
  const { account } = useWallet()
  const { addEnergy, addTokens, addNotification } = useGameState()
  const [activeFeature, setActiveFeature] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleVoiceCommand = async (command) => {
    if (!currentPet) return

    const actions = {
      'feed': () => performPetAction(currentPet.id, 'feed'),
      'play': () => performPetAction(currentPet.id, 'play'),
      'rest': () => performPetAction(currentPet.id, 'rest'),
      'meditate': () => setActiveFeature('meditation'),
      'greet': () => addNotification({
        type: 'pet',
        message: `${currentPet.name} says hello back!`,
        read: false
      }),
      'status': () => addNotification({
        type: 'pet',
        message: `${currentPet.name} is feeling ${currentPet.mood} today!`,
        read: false
      }),
      'praise': () => {
        updatePetMood(currentPet.id, 'happy')
        addNotification({
          type: 'pet',
          message: `${currentPet.name} is beaming with happiness!`,
          read: false
        })
      }
    }

    if (actions[command]) {
      await actions[command]()
    }
  }

  const handleGameComplete = (result) => {
    addEnergy(result.energy)
    addTokens(result.tokens)
    addNotification({
      type: 'game',
      message: `Earned ${result.energy} energy and ${result.tokens} tokens from ${result.game.name}!`,
      read: false
    })

    if (result.perfect) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  const handleMoodChange = (newMood) => {
    if (currentPet) {
      updatePetMood(currentPet.id, newMood)
    }
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

  // Render active feature modal
  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'ar':
        return <ARPetViewer pet={currentPet} onClose={() => setActiveFeature(null)} />
      case 'meditation':
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-morphism rounded-2xl max-w-2xl w-full">
              <GuidedMeditation onComplete={() => {
                setActiveFeature(null)
                addEnergy(10)
                addTokens(20)
              }} />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Confetti isActive={showConfetti} />
      {renderActiveFeature()}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Sanctuary</h1>
            <p className="text-gray-400">
              Welcome back! Your {currentPet.name} is waiting for you.
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFeature('ar')}
              className="bg-accent-teal hover:bg-accent-mint text-primary font-semibold py-2 px-4 rounded-xl transition-all duration-300 flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>AR View</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFeature('meditation')}
              className="bg-accent-cyan hover:bg-accent-teal text-primary font-semibold py-2 px-4 rounded-xl transition-all duration-300 flex items-center space-x-2"
            >
              <Video className="w-4 h-4" />
              <span>Meditate</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Pet & AI */}
        <div className="lg:col-span-2 space-y-6">
          <PetCard pet={currentPet} />
          
          {/* AI Companion */}
          <AIPetCompanion 
            pet={currentPet}
            onMoodChange={handleMoodChange}
          />

          {/* Stats Chart */}
          <PetStatsChart pet={currentPet} />
        </div>

        {/* Right Column - Features */}
        <div className="space-y-6">
          <StreakCounter />
          
          {/* Voice Commands */}
          <VoiceCommands 
            onCommand={handleVoiceCommand}
            pet={currentPet}
          />

          {/* Mini Games */}
          <MiniGames onComplete={handleGameComplete} />

          {/* Seasonal Events */}
          <SeasonalEvents />

          {/* Energy Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
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

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Try These Features</h3>
            <div className="space-y-3">
              {[
                { icon: <Brain className="w-5 h-5" />, label: 'AI Chat', description: 'Talk with your pet' },
                { icon: <Mic className="w-5 h-5" />, label: 'Voice Commands', description: 'Hands-free control' },
                { icon: <Gamepad className="w-5 h-5" />, label: 'Mini Games', description: 'Earn rewards' },
                { icon: <Camera className="w-5 h-5" />, label: 'AR Mode', description: 'See pet in real world' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="text-accent-cyan">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{feature.label}</div>
                    <div className="text-xs text-gray-400">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard