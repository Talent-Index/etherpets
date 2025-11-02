import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'

const GuidedMeditation = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(300) // 5 minutes in seconds
  const [isMuted, setIsMuted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const audioRef = useRef(null)

  const meditationSteps = [
    {
      title: "Finding Comfort",
      description: "Settle into a comfortable position and close your eyes",
      duration: 30,
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "Breath Awareness",
      description: "Bring your attention to your natural breathing rhythm",
      duration: 60,
      color: "from-purple-400 to-pink-400"
    },
    {
      title: "Body Scan",
      description: "Slowly scan through your body from head to toe",
      duration: 90,
      color: "from-green-400 to-emerald-400"
    },
    {
      title: "Mindful Presence",
      description: "Observe your thoughts without judgment",
      duration: 80,
      color: "from-orange-400 to-amber-400"
    },
    {
      title: "Returning",
      description: "Gently bring awareness back to your surroundings",
      duration: 40,
      color: "from-indigo-400 to-purple-400"
    }
  ]

  useEffect(() => {
    let interval
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1
          
          // Check if we should move to next step
          const stepEndTime = meditationSteps.slice(0, currentStep + 1).reduce((sum, step) => sum + step.duration, 0)
          if (newTime >= stepEndTime && currentStep < meditationSteps.length - 1) {
            setCurrentStep(prevStep => prevStep + 1)
          }
          
          return newTime
        })
      }, 1000)
    } else if (currentTime >= duration) {
      setIsPlaying(false)
      onComplete?.()
    }

    return () => clearInterval(interval)
  }, [isPlaying, currentTime, duration, currentStep])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (currentTime / duration) * 100
  const stepProgress = ((currentTime - meditationSteps.slice(0, currentStep).reduce((sum, step) => sum + step.duration, 0)) / meditationSteps[currentStep].duration) * 100

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    setCurrentTime(0)
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const handleSkip = (forward = true) => {
    if (forward && currentStep < meditationSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setCurrentTime(meditationSteps.slice(0, currentStep + 1).reduce((sum, step) => sum + step.duration, 0))
    } else if (!forward && currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setCurrentTime(meditationSteps.slice(0, currentStep - 1).reduce((sum, step) => sum + step.duration, 0))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-morphism rounded-2xl overflow-hidden"
    >
      {/* Current Step Header */}
      <div className={`bg-gradient-to-r ${meditationSteps[currentStep].color} p-6 text-white`}>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{meditationSteps[currentStep].title}</h3>
          <p className="text-white/90">{meditationSteps[currentStep].description}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress Indicators */}
        <div className="space-y-4">
          {/* Main Progress */}
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Session Progress</span>
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-3 bg-gradient-to-r from-accent-cyan to-accent-teal rounded-full transition-all duration-1000"
              />
            </div>
          </div>

          {/* Step Progress */}
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Current Step</span>
              <span>{currentStep + 1} of {meditationSteps.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stepProgress}%` }}
                className="h-2 bg-white/60 rounded-full transition-all duration-1000"
              />
            </div>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between">
          {meditationSteps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center space-y-2 ${
                index <= currentStep ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? `bg-gradient-to-r ${step.color} scale-125`
                    : index < currentStep
                    ? 'bg-accent-teal'
                    : 'bg-gray-500'
                }`}
              />
              <div className="text-xs text-gray-400 text-center max-w-16">
                {step.title.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>

        {/* Breathing Animation */}
        <div className="flex justify-center py-4">
          <motion.div
            animate={{
              scale: isPlaying ? [1, 1.2, 1] : 1,
              opacity: isPlaying ? [0.7, 1, 0.7] : 0.7
            }}
            transition={{
              duration: 4,
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="w-24 h-24 rounded-full bg-gradient-to-r from-accent-cyan to-accent-teal flex items-center justify-center"
          >
            <span className="text-white text-sm font-semibold">
              {isPlaying ? 'Breathe' : 'Paused'}
            </span>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={() => handleSkip(false)}
            disabled={currentStep === 0}
            className="p-3 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={handlePlayPause}
            className="w-16 h-16 bg-accent-teal hover:bg-accent-mint text-primary rounded-full flex items-center justify-center transition-all duration-300"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>

          <button
            onClick={() => handleSkip(true)}
            disabled={currentStep === meditationSteps.length - 1}
            className="p-3 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleRestart}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Restart
          </button>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Benefits */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <p className="text-sm text-gray-400 text-center">
          🧘 This meditation will boost your pet's happiness and earn +10 energy
        </p>
      </div>
    </motion.div>
  )
}

export default GuidedMeditation