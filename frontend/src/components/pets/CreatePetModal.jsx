import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles, Heart, Zap, Eye } from 'lucide-react'

const CreatePetModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    color: '#5BC0BE',
    personality: ''
  })

  const [step, setStep] = useState(1)

  const petTypes = [
    {
      id: 'spirit_fox',
      name: 'Spirit Fox',
      emoji: '🦊',
      description: 'Wise, intuitive, and mystical companion',
      abilities: ['Intuition', 'Wisdom', 'Protection'],
      color: 'from-orange-400 to-red-400'
    },
    {
      id: 'moon_rabbit',
      name: 'Moon Rabbit',
      emoji: '🐇',
      description: 'Gentle, nurturing, and dreamy friend',
      abilities: ['Healing', 'Comfort', 'Dreams'],
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'star_cat',
      name: 'Star Cat',
      emoji: '🐈',
      description: 'Playful, curious, and agile explorer',
      abilities: ['Curiosity', 'Agility', 'Luck'],
      color: 'from-yellow-400 to-amber-400'
    },
    {
      id: 'crystal_dragon',
      name: 'Crystal Dragon',
      emoji: '🐲',
      description: 'Ancient, powerful, and magical guardian',
      abilities: ['Strength', 'Magic', 'Guidance'],
      color: 'from-cyan-400 to-blue-400'
    },
    {
      id: 'forest_deer',
      name: 'Forest Deer',
      emoji: '🦌',
      description: 'Graceful, peaceful, and connected to nature',
      abilities: ['Peace', 'Growth', 'Harmony'],
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 'ocean_whale',
      name: 'Ocean Whale',
      emoji: '🐋',
      description: 'Deep, emotional, and wise ocean spirit',
      abilities: ['Emotion', 'Depth', 'Calm'],
      color: 'from-blue-400 to-indigo-400'
    }
  ]

  const personalities = [
    { id: 'playful', label: 'Playful', emoji: '😄', description: 'Energetic and fun-loving' },
    { id: 'calm', label: 'Calm', emoji: '😌', description: 'Peaceful and relaxed' },
    { id: 'curious', label: 'Curious', emoji: '🤔', description: 'Inquisitive and exploratory' },
    { id: 'loyal', label: 'Loyal', emoji: '💝', description: 'Devoted and protective' },
    { id: 'mysterious', label: 'Mysterious', emoji: '🔮', description: 'Enigmatic and wise' },
    { id: 'gentle', label: 'Gentle', emoji: '🌿', description: 'Kind and nurturing' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.type || !formData.personality) return

    const petData = {
      ...formData,
      id: Date.now().toString(),
      level: 1,
      energy: 50,
      happiness: 50,
      mood: 'neutral',
      createdAt: new Date().toISOString()
    }

    onCreate?.(petData)
    onClose?.()
    
    // Reset form
    setFormData({
      name: '',
      type: '',
      color: '#5BC0BE',
      personality: ''
    })
    setStep(1)
  }

  const selectedType = petTypes.find(type => type.id === formData.type)
  const selectedPersonality = personalities.find(p => p.id === formData.personality)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-morphism rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold">Create Your SoulPet</h2>
            <p className="text-gray-400">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Choose Type */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-accent-cyan" />
                    <span>Choose Your Companion</span>
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Select a spirit animal that resonates with your energy
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {petTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                          formData.type === type.id
                            ? `border-white bg-gradient-to-br ${type.color} scale-105`
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{type.emoji}</span>
                          <div>
                            <div className="font-semibold">{type.name}</div>
                            <div className="text-sm text-gray-300">{type.description}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {type.abilities.map((ability) => (
                            <span
                              key={ability}
                              className="px-2 py-1 bg-black/20 rounded text-xs font-medium"
                            >
                              {ability}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!formData.type}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Choose Personality */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span>Choose Personality</span>
                  </h3>
                  <p className="text-gray-400 mb-6">
                    What kind of energy does your companion have?
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {personalities.map((personality) => (
                      <button
                        key={personality.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, personality: personality.id }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          formData.personality === personality.id
                            ? 'border-accent-teal bg-accent-teal/20 scale-105'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-2xl mb-2">{personality.emoji}</div>
                        <div className="font-medium text-sm">{personality.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{personality.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!formData.personality}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Name and Finalize */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span>Name Your Companion</span>
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Pet Preview */}
                    {selectedType && (
                      <div className="bg-white/5 rounded-xl p-6 text-center">
                        <div className="text-6xl mb-4">{selectedType.emoji}</div>
                        <div className="text-2xl font-bold text-accent-mint">
                          {formData.name || 'Your Pet'}
                        </div>
                        <div className="text-gray-400">
                          {selectedType.name} • {selectedPersonality?.label}
                        </div>
                      </div>
                    )}

                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Choose a meaningful name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your pet's name..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-accent-teal transition-colors text-center text-xl font-semibold"
                        maxLength={20}
                      />
                      <div className="text-right text-sm text-gray-400 mt-2">
                        {formData.name.length}/20 characters
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Choose aura color
                      </label>
                      <div className="flex justify-center space-x-4">
                        {['#5BC0BE', '#6FFFE9', '#C9A0DC', '#FFB347', '#A8E6CF', '#FF6B6B'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                              formData.color === color ? 'border-white scale-110' : 'border-white/30'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.name.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create SoulPet
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  stepNumber === step
                    ? 'bg-accent-teal text-primary'
                    : stepNumber < step
                    ? 'bg-accent-mint text-primary'
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
                    stepNumber < step ? 'bg-accent-mint' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CreatePetModal