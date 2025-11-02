import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad, Target, Puzzle, Star, Zap, RotateCcw } from 'lucide-react'

const MiniGames = ({ onComplete, energyCost = 5 }) => {
  const [activeGame, setActiveGame] = useState(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)

  const games = [
    {
      id: 'breathing',
      name: 'Breathing Rhythm',
      description: 'Match the breathing pattern to earn energy',
      icon: '🌬️',
      color: 'from-blue-400 to-cyan-400',
      duration: 30
    },
    {
      id: 'focus',
      name: 'Focus Challenge',
      description: 'Maintain focus as distractions appear',
      icon: '🎯',
      color: 'from-purple-400 to-pink-400',
      duration: 45
    },
    {
      id: 'memory',
      name: 'Memory Match',
      description: 'Test your memory with calming patterns',
      icon: '🧩',
      color: 'from-green-400 to-emerald-400',
      duration: 60
    },
    {
      id: 'reaction',
      name: 'Reaction Time',
      description: 'Quick responses for mindfulness training',
      icon: '⚡',
      color: 'from-yellow-400 to-orange-400',
      duration: 40
    }
  ]

  useEffect(() => {
    let timer
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [gameActive, timeLeft])

  const startGame = (game) => {
    setActiveGame(game)
    setScore(0)
    setTimeLeft(game.duration)
    setGameActive(true)
  }

  const endGame = () => {
    setGameActive(false)
    const energyEarned = Math.floor(score / 10) + 5
    const tokensEarned = Math.floor(score / 5)
    
    onComplete?.({
      game: activeGame,
      score,
      energy: energyEarned,
      tokens: tokensEarned,
      perfect: score >= 80
    })
  }

  const renderGame = () => {
    if (!activeGame) return null

    switch (activeGame.id) {
      case 'breathing':
        return <BreathingGame onScoreUpdate={setScore} />
      case 'focus':
        return <FocusGame onScoreUpdate={setScore} />
      case 'memory':
        return <MemoryGame onScoreUpdate={setScore} />
      case 'reaction':
        return <ReactionGame onScoreUpdate={setScore} />
      default:
        return null
    }
  }

  if (activeGame) {
    return (
      <div className="glass-morphism rounded-xl overflow-hidden">
        {/* Game Header */}
        <div className={`bg-gradient-to-r ${activeGame.color} p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{activeGame.icon}</span>
              <div>
                <h3 className="font-semibold">{activeGame.name}</h3>
                <p className="text-white/80 text-sm">{activeGame.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm opacity-80">Score</div>
            </div>
          </div>
        </div>

        {/* Game Stats */}
        <div className="p-4 bg-white/5 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Cost: {energyCost} energy</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-accent-cyan" />
                <span className="text-sm">Time: {timeLeft}s</span>
              </div>
            </div>

            {gameActive && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 bg-red-400 rounded-full"
              />
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / activeGame.duration) * 100}%` }}
              transition={{ duration: timeLeft, ease: 'linear' }}
              className="h-2 bg-accent-mint rounded-full"
            />
          </div>
        </div>

        {/* Game Content */}
        <div className="p-6 min-h-64 flex items-center justify-center">
          {renderGame()}
        </div>

        {/* Game Controls */}
        <div className="p-4 border-t border-white/10">
          {!gameActive ? (
            <div className="flex space-x-3">
              <button
                onClick={() => startGame(activeGame)}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <button
                onClick={() => setActiveGame(null)}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Back to Games
              </button>
            </div>
          ) : (
            <button
              onClick={endGame}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              End Game
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-morphism p-6 rounded-xl">
      <div className="flex items-center space-x-3 mb-6">
        <Gamepad className="w-6 h-6 text-accent-cyan" />
        <h3 className="text-lg font-semibold">Mindfulness Games</h3>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        Play these calming games to train your focus and earn rewards for your pet.
        Each game costs {energyCost} energy.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => startGame(game)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${game.color} flex items-center justify-center text-xl`}>
                {game.icon}
              </div>
              <div>
                <h4 className="font-semibold group-hover:text-accent-mint transition-colors">
                  {game.name}
                </h4>
                <p className="text-sm text-gray-400">{game.duration}s</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">{game.description}</p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Zap className="w-3 h-3" />
                <span>{energyCost} energy</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-yellow-400">
                <Star className="w-3 h-3" />
                <span>+5-15 tokens</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Example Game Components
const BreathingGame = ({ onScoreUpdate }) => {
  const [phase, setPhase] = useState('inhale') // inhale, hold, exhale
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setPhase(prev => {
            if (prev === 'inhale') return 'hold'
            if (prev === 'hold') return 'exhale'
            return 'inhale'
          })
          return 0
        }
        return prev + 5
      })
    }, 500)

    // Score based on rhythm matching
    const scoreInterval = setInterval(() => {
      onScoreUpdate(prev => prev + 2)
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(scoreInterval)
    }
  }, [])

  return (
    <div className="text-center space-y-6">
      <motion.div
        animate={{
          scale: phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1,
          opacity: phase === 'hold' ? 0.7 : 1
        }}
        transition={{ duration: 4 }}
        className="w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mx-auto flex items-center justify-center"
      >
        <span className="text-white text-lg font-semibold">
          {phase === 'inhale' ? 'Breathe In' : phase === 'exhale' ? 'Breathe Out' : 'Hold'}
        </span>
      </motion.div>
      
      <div className="w-48 bg-gray-700 rounded-full h-3 mx-auto">
        <div 
          className="h-3 bg-accent-mint rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-gray-400 text-sm">
        Follow the breathing circle. Inhale as it grows, exhale as it shrinks.
      </p>
    </div>
  )
}

const FocusGame = ({ onScoreUpdate }) => {
  const [points, setPoints] = useState([])
  const [clickedPoints, setClickedPoints] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (points.length < 8) {
        const newPoint = {
          id: Date.now(),
          x: Math.random() * 200,
          y: Math.random() * 200,
          type: Math.random() > 0.7 ? 'distraction' : 'focus'
        }
        setPoints(prev => [...prev, newPoint])
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [points.length])

  const handlePointClick = (point) => {
    if (point.type === 'focus') {
      onScoreUpdate(prev => prev + 5)
      setClickedPoints(prev => [...prev, point.id])
    } else {
      onScoreUpdate(prev => Math.max(0, prev - 3))
    }
    setPoints(prev => prev.filter(p => p.id !== point.id))
  }

  return (
    <div className="text-center">
      <h4 className="text-lg font-semibold mb-4">Click the Focus Points</h4>
      <div className="relative w-64 h-64 bg-white/5 rounded-xl mx-auto border-2 border-dashed border-accent-teal/30">
        {points.map(point => (
          <motion.button
            key={point.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => handlePointClick(point)}
            className={`absolute w-6 h-6 rounded-full ${
              point.type === 'focus' 
                ? 'bg-accent-mint hover:bg-accent-cyan' 
                : 'bg-red-400 hover:bg-red-500'
            } transition-colors`}
            style={{ left: point.x, top: point.y }}
          />
        ))}
      </div>
      <p className="text-gray-400 text-sm mt-4">
        Click green points for points, avoid red distractions
      </p>
    </div>
  )
}

const MemoryGame = ({ onScoreUpdate }) => {
  return (
    <div className="text-center space-y-4">
      <h4 className="text-lg font-semibold">Memory Match</h4>
      <p className="text-gray-400 text-sm">Remember and match the patterns</p>
      <div className="grid grid-cols-4 gap-2 w-48 mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 bg-accent-teal/30 rounded-lg flex items-center justify-center text-lg cursor-pointer hover:bg-accent-teal/50 transition-colors"
          >
            ?
          </div>
        ))}
      </div>
    </div>
  )
}

const ReactionGame = ({ onScoreUpdate }) => {
  return (
    <div className="text-center space-y-4">
      <h4 className="text-lg font-semibold">Reaction Test</h4>
      <p className="text-gray-400 text-sm">Click when the circle turns green</p>
      <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto flex items-center justify-center">
        <span className="text-white">Wait...</span>
      </div>
    </div>
  )
}

export default MiniGames