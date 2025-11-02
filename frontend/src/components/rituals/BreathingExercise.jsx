import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BreathingExercise = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState('inhale')
  const [cycles, setCycles] = useState(0)
  const [timeLeft, setTimeLeft] = useState(4)

  const phases = {
    inhale: { duration: 4000, color: 'from-accent-teal to-accent-mint', label: 'Breathe In' },
    hold: { duration: 4000, color: 'from-accent-cyan to-accent-teal', label: 'Hold' },
    exhale: { duration: 4000, color: 'from-accent-lavender to-accent-cyan', label: 'Breathe Out' }
  }

  useEffect(() => {
    let interval
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next phase
            const phaseKeys = Object.keys(phases)
            const currentIndex = phaseKeys.indexOf(currentPhase)
            const nextIndex = (currentIndex + 1) % phaseKeys.length
            const nextPhase = phaseKeys[nextIndex]
            
            setCurrentPhase(nextPhase)
            
            // Count cycle when returning to inhale
            if (nextPhase === 'inhale') {
              setCycles(prev => {
                if (prev >= 4) { // Complete after 4 cycles
                  setIsActive(false)
                  onComplete?.()
                  return 0
                }
                return prev + 1
              })
            }
            
            return phases[nextPhase].duration / 1000
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, currentPhase, cycles])

  const startExercise = () => {
    setIsActive(true)
    setCycles(0)
    setCurrentPhase('inhale')
    setTimeLeft(phases.inhale.duration / 1000)
  }

  const currentPhaseConfig = phases[currentPhase]

  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        {!isActive ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">Breathing Exercise</h3>
            <p className="text-gray-400">
              Follow the rhythm to calm your mind and energize your pet
            </p>
            <button
              onClick={startExercise}
              className="btn-primary"
            >
              Begin Breathing
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="exercise"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Breathing Circle */}
            <div className="flex justify-center">
              <motion.div
                animate={{
                  scale: currentPhase === 'inhale' ? 1.2 : 
                         currentPhase === 'hold' ? 1.2 : 1,
                  opacity: currentPhase === 'exhale' ? 0.8 : 1
                }}
                transition={{
                  duration: currentPhaseConfig.duration / 1000,
                  ease: currentPhase === 'inhale' ? 'easeOut' : 
                        currentPhase === 'exhale' ? 'easeIn' : 'linear'
                }}
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${currentPhaseConfig.color} flex items-center justify-center shadow-2xl`}
              >
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">{timeLeft}</div>
                  <div className="text-lg">{currentPhaseConfig.label}</div>
                </div>
              </motion.div>
            </div>

            {/* Progress */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Cycle {cycles}/4</span>
                <span>{currentPhaseConfig.label}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: timeLeft, ease: 'linear' }}
                  className="h-2 bg-accent-mint rounded-full"
                />
              </div>
            </div>

            <button
              onClick={() => setIsActive(false)}
              className="btn-secondary"
            >
              Stop Exercise
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BreathingExercise