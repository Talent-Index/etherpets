import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Heart, Brain, Zap, Star } from 'lucide-react'

const ReflectionForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    mood: '',
    reflection: '',
    gratitude: ['', '', ''],
    energyLevel: 5,
    focusLevel: 5
  })

  const moods = [
    { id: 'excited', label: 'Excited', emoji: '🤩', color: 'from-yellow-400 to-orange-400' },
    { id: 'happy', label: 'Happy', emoji: '😊', color: 'from-green-400 to-emerald-400' },
    { id: 'calm', label: 'Calm', emoji: '😌', color: 'from-blue-400 to-cyan-400' },
    { id: 'neutral', label: 'Neutral', emoji: '😐', color: 'from-gray-400 to-gray-500' },
    { id: 'tired', label: 'Tired', emoji: '😴', color: 'from-purple-400 to-indigo-400' },
    { id: 'anxious', label: 'Anxious', emoji: '😰', color: 'from-red-400 to-pink-400' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.mood || !formData.reflection.trim()) return
    
    const submission = {
      ...formData,
      timestamp: new Date().toISOString(),
      gratitude: formData.gratitude.filter(item => item.trim() !== '')
    }
    
    onSubmit?.(submission)
    
    // Reset form
    setFormData({
      mood: '',
      reflection: '',
      gratitude: ['', '', ''],
      energyLevel: 5,
      focusLevel: 5
    })
  }

  const updateGratitude = (index, value) => {
    const newGratitude = [...formData.gratitude]
    newGratitude[index] = value
    setFormData(prev => ({ ...prev, gratitude: newGratitude }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-6 rounded-xl"
    >
      <h3 className="text-2xl font-bold mb-6 text-center">Daily Reflection</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            How are you feeling right now?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, mood: mood.id }))}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.mood === mood.id
                    ? `border-white bg-gradient-to-br ${mood.color} scale-105`
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-2xl mb-2">{mood.emoji}</div>
                <div className="text-sm font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Energy & Focus Levels */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Energy Level</span>
              </div>
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, energyLevel: level }))}
                  className={`w-8 h-8 rounded-full transition-all duration-300 ${
                    level <= formData.energyLevel
                      ? 'bg-yellow-400 scale-110'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex items-center space-x-2 mb-1">
                <Brain className="w-4 h-4 text-blue-400" />
                <span>Focus Level</span>
              </div>
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, focusLevel: level }))}
                  className={`w-8 h-8 rounded-full transition-all duration-300 ${
                    level <= formData.focusLevel
                      ? 'bg-blue-400 scale-110'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Distracted</span>
              <span>Focused</span>
            </div>
          </div>
        </div>

        {/* Gratitude Journal */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Three things I'm grateful for today:</span>
            </div>
          </label>
          <div className="space-y-3">
            {formData.gratitude.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-accent-teal/20 text-accent-teal rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateGratitude(index, e.target.value)}
                  placeholder={`Gratitude ${index + 1}...`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-accent-teal transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reflection Text */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-accent-mint" />
              <span>What's on your mind today?</span>
            </div>
          </label>
          <textarea
            value={formData.reflection}
            onChange={(e) => setFormData(prev => ({ ...prev, reflection: e.target.value }))}
            placeholder="Reflect on your day, your feelings, or anything that stands out..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-accent-teal transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!formData.mood || !formData.reflection.trim()}
            className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Save Reflection</span>
          </button>
        </div>
      </form>

      {/* Benefits Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-accent-teal/10 border border-accent-teal/20 rounded-xl"
      >
        <p className="text-sm text-accent-teal text-center">
          💫 Regular reflection boosts your pet's happiness and earns you energy rewards!
        </p>
      </motion.div>
    </motion.div>
  )
}

export default ReflectionForm