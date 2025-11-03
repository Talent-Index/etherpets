/**
 * Breathing Exercise Component
 * A guided visual breathing exercise to promote calmness and mindfulness.
 * It cycles through "Breathe In", "Hold", and "Breathe Out" phases.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BreathingExercise = ({ onComplete, duration = 60 }) => {
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
  const [timeLeft, setTimeLeft] = useState(duration);
  const [cycleText, setCycleText] = useState('Get Ready...');

  const cycle = {
    inhale: { duration: 4, text: 'Breathe In...' },
    hold: { duration: 4, text: 'Hold...' },
    exhale: { duration: 6, text: 'Breathe Out...' },
  };

  useEffect(() => {
    const totalCycleTime = cycle.inhale.duration + cycle.hold.duration + cycle.exhale.duration;
    let phaseTimer;
    let currentPhase = 'inhale';

    const runCycle = () => {
      setPhase(currentPhase);
      setCycleText(cycle[currentPhase].text);

      phaseTimer = setTimeout(() => {
        if (currentPhase === 'inhale') currentPhase = 'hold';
        else if (currentPhase === 'hold') currentPhase = 'exhale';
        else currentPhase = 'inhale';
        runCycle();
      }, cycle[currentPhase].duration * 1000);
    };

    const startTimeout = setTimeout(runCycle, 2000); // Initial delay

    const mainTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(mainTimer);
          clearTimeout(phaseTimer);
          clearTimeout(startTimeout);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(mainTimer);
      clearTimeout(phaseTimer);
      clearTimeout(startTimeout);
    };
  }, [onComplete]);

  return (
    <div className="text-center flex flex-col items-center justify-center space-y-8">
      <h2 className="text-2xl font-bold text-white">Mindful Breathing</h2>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          className="absolute w-full h-full bg-blue-500/20 rounded-full"
          animate={{
            scale: phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1.1,
          }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 6 : 4, ease: 'easeInOut' }}
        />
        <motion.div
          className="w-48 h-48 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center shadow-lg"
          animate={{
            scale: phase === 'inhale' ? 1 : phase === 'exhale' ? 0.7 : 0.9,
          }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 6 : 4, ease: 'easeInOut' }}
        >
          <span className="text-primary text-xl font-semibold">
            {cycleText}
          </span>
        </motion.div>
      </div>

      <p className="text-gray-400">
        Follow the rhythm. Time remaining: {timeLeft}s
      </p>

      <button onClick={onComplete} className="btn-secondary text-sm">End Session</button>
    </div>
  );
};

export default BreathingExercise;