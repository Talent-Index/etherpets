/**
 * Tutorial/Onboarding Page
 * Guides new users through the EtherPets features and gameplay
 */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Sparkles, 
  Heart, 
  Users,
  Zap,
  CheckCircle
} from 'lucide-react'

const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  const tutorialSteps = [
    {
      title: "Welcome to EtherPets!",
      description: "Discover a unique journey of mindfulness and digital companionship where your emotions shape magical creatures.",
      icon: <Sparkles className="w-8 h-8" />,
      image: "🌟",
      color: "from-purple-400 to-pink-400",
      features: [
        "Mindful gaming experience",
        "Emotional wellness tracking",
        "Blockchain-powered companions"
      ]
    },
    {
      title: "Meet Your SoulPet",
      description: "Your digital companion reflects your emotional state and grows with your mindfulness practice.",
      icon: <Heart className="w-8 h-8" />,
      image: "🐾",
      color: "from-red-400 to-pink-400",
      features: [
        "Create your unique companion",
        "Watch it evolve with your mood",
        "Build emotional connections"
      ]
    },
    {
      title: "Daily Rituals",
      description: "Practice mindfulness through daily activities that benefit both you and your pet.",
      icon: <Zap className="w-8 h-8" />,
      image: "🧘",
      color: "from-blue-400 to-cyan-400",
      features: [
        "Breathing exercises",
        "Meditation sessions",
        "Gratitude journaling"
      ]
    },
    {
      title: "Community Gardens",
      description: "Join other players in collaborative spaces where you can grow together.",
      icon: <Users className="w-8 h-8" />,
      image: "🌿",
      color: "from-green-400 to-emerald-400",
      features: [
        "Collaborative puzzles",
        "Social interactions",
        "Shared achievements"
      ]
    },
    {
      title: "Earn & Grow",
      description: "Your mindfulness journey rewards you with energy, tokens, and pet evolution.",
      icon: <Sparkles className="w-8 h-8" />,
      image: "⚡",
      color: "from-yellow-400 to-orange-400",
      features: [
        "Energy management",
        "Token rewards",
        "Progression system"
      ]
    }
  ]

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCompleted(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTutorial = () => {
    setCompleted(true)
    // In a real app, you would save this preference
    localStorage.setItem('etherpets-tutorial-completed', 'true')
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-primary" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-accent-mint mb-4">
            Tutorial Complete!
          </h1>
          <p className="text-gray-400 mb-8">
            You're all set to begin your EtherPets journey. 
            Your mindfulness adventure starts now!
          </p>

          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Start Your Journey</span>
            </Link>
            
            <button
              onClick={() => setCompleted(false)}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Review Tutorial Again
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const currentStepData = tutorialSteps[currentStep]

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="glass-morphism rounded-2xl overflow-hidden"
        >
          {/* Progress Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentStepData.color} flex items-center justify-center text-white`}>
                  {currentStepData.icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold">Getting Started</h1>
                  <p className="text-gray-400 text-sm">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </p>
                </div>
              </div>
              
              <button
                onClick={skipTutorial}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Skip Tutorial
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-2 bg-gradient-to-r from-accent-cyan to-accent-teal rounded-full"
              />
            </div>
          </div>

          {/* Tutorial Content */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    {currentStepData.title}
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {currentStepData.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-6 h-6 bg-accent-teal/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-accent-teal" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Visual Content */}
              <div className="flex justify-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-48 h-48 rounded-2xl bg-gradient-to-br ${currentStepData.color} flex items-center justify-center text-6xl shadow-2xl`}
                >
                  {currentStepData.image}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20 text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-accent-teal'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="btn-primary flex items-center space-x-2"
              >
                <span>
                  {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Start Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-400 text-sm">
            💡 You can always access this tutorial from the Settings page
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Tutorial