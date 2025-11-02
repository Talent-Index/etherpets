import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import BreathingExercise from '../components/rituals/BreathingExercise'
import { Brain, Heart, Zap, Star, Send } from 'lucide-react'

const Reflection = () => {
  const { currentPet, updatePetMood } = useUser()
  const [reflectionText, setReflectionText] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [showBreathing, setShowBreathing] = useState(false)
  const [recentReflections, setRecentReflections] = useState([])

  const moods = [
    { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-mood-happy/20 border-mood-hover' },
    { id: 'calm', label: 'Calm', emoji: '😌', color: 'bg-mood-calm/20 border-mood-calm' },
    { id: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-gray-400/20 border-gray-400' },
    { id: 'sad', label: 'Sad', emoji: '😔', color: 'bg-mood-sad/20 border-mood-sad' },
    { id: 'excited', label: 'Excited', emoji: '🤩', color: 'bg-mood-excited/20 border-mood-excited' }
  ]

  const handleSubmitReflection = () => {
    if (!reflectionText.trim() || !selectedMood) return

    const newReflection = {
      id: Date.now(),
      text: reflectionText,
      mood: selectedMood,
      timestamp: new Date().toISOString(),
      energyReward: 10
    }

    setRecentReflections(prev => [newReflection, ...prev.slice(0, 4)])
    
    // Update pet mood
    if (currentPet) {
      updatePetMood(currentPet.id, selectedMood)
    }

    // Clear form
    setReflectionText('')
    setSelectedMood('')
  }

  const handleBreathingComplete = () => {
    setShowBreathing(false)
    // Reward player and pet
    if (currentPet) {
      updatePetMood(currentPet.id, 'calm')
    }
  }

  if (!currentPet) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">No Pet Found</h2>
        <p className="text-gray-400 mb-8">Create your SoulPet to begin reflection</p>
        <button className="btn-primary">Create SoulPet</button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-2">Mindful Reflection</h1>
        <p className="text-gray-400">
          Take a moment to reflect and connect with your inner self
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Reflection Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Practices</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowBreathing(true)}
                className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl p-4 text-left transition-all duration-300 group"
              >
                <Zap className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-medium">Breathing</div>
                <div className="text-sm text-gray-400">5 min • Calm focus</div>
              </button>
              <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl p-4 text-left transition-all duration-300 group">
                <Brain className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-medium">Meditation</div>
                <div className="text-sm text-gray-400">10 min • Clear mind</div>
              </button>
            </div>
          </motion.div>

          {/* Breathing Exercise Modal */}
          {showBreathing && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="glass-morphism rounded-2xl p-8 max-w-md w-full">
                <BreathingExercise onComplete={handleBreathingComplete} />
              </div>
            </div>
          )}

          {/* Reflection Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Daily Reflection</h3>
            
            {/* Mood Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                How are you feeling today?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      selectedMood === mood.id
                        ? `${mood.color} scale-105`
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reflection Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                What's on your mind?
              </label>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Write about your day, things you're grateful for, or anything that's on your mind..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-accent-teal transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitReflection}
              disabled={!reflectionText.trim() || !selectedMood}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Save Reflection</span>
            </button>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Reflections */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Recent Reflections</h3>
            <div className="space-y-4">
              {recentReflections.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No reflections yet
                </p>
              ) : (
                recentReflections.map((reflection) => (
                  <div
                    key={reflection.id}
                    className="bg-white/5 rounded-lg p-3 border-l-4 border-accent-teal"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">
                        {moods.find(m => m.id === reflection.mood)?.emoji}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(reflection.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {reflection.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-morphism p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Benefits</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-sm">Reduces stress and anxiety</span>
              </div>
              <div className="flex items-center space-x-3">
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Improves focus and clarity</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Boosts pet happiness</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-accent-cyan" />
                <span className="text-sm">Earn energy rewards</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Reflection