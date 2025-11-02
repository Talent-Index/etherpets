import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Brain, Heart, Zap, Sparkles, User } from 'lucide-react'

const AIPetCompanion = ({ pet, onMoodChange }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])
  const messagesEndRef = useRef(null)

  // Initial greeting based on pet mood
  useEffect(() => {
    const greetings = {
      happy: `Hello! I'm ${pet.name}, and I'm feeling wonderful today! ✨`,
      calm: `Greetings. I'm ${pet.name}, feeling peaceful and centered. 🌿`,
      excited: `Hi there! I'm ${pet.name} and I'm bursting with energy! 🎉`,
      sad: `Hello... I'm ${pet.name}. Could use some company today. 💫`,
      neutral: `Hi, I'm ${pet.name}. Ready to see what today brings. `
    }

    const initialMessage = {
      id: 1,
      text: greetings[pet.mood] || greetings.neutral,
      sender: 'pet',
      timestamp: new Date(),
      mood: pet.mood
    }

    setMessages([initialMessage])
    setConversationHistory([initialMessage])
  }, [pet.name, pet.mood])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAIResponse = async (userMessage) => {
    setIsTyping(true)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simple rule-based responses (in a real app, this would call an AI API)
    const userText = userMessage.toLowerCase()
    let response = ''
    let mood = pet.mood

    if (userText.includes('how are you') || userText.includes('how do you feel')) {
      const responses = {
        happy: "I'm feeling absolutely fantastic! Full of energy and joy! 🌈",
        calm: "I'm very peaceful and content. Everything feels balanced. 🍃",
        excited: "So much energy! I feel like I could run for days! ⚡",
        sad: "I'm feeling a bit down today, but talking to you helps. 🌧️",
        neutral: "I'm doing okay, just taking things as they come. "
      }
      response = responses[pet.mood] || responses.neutral
    }
    else if (userText.includes('play') || userText.includes('game')) {
      response = "I'd love to play! What should we do together? 🎮"
      mood = 'excited'
    }
    else if (userText.includes('meditate') || userText.includes('calm')) {
      response = "Meditation sounds perfect. Let's find our center together. 🧘"
      mood = 'calm'
    }
    else if (userText.includes('feed') || userText.includes('hungry')) {
      response = "Thank you! I was getting a bit peckish. 🍎"
      mood = 'happy'
    }
    else if (userText.includes('love') || userText.includes('care')) {
      response = "I feel so loved and cared for. You're the best! 💖"
      mood = 'happy'
    }
    else if (userText.includes('tired') || userText.includes('sleep')) {
      response = "I could use some rest. Let's recharge together. 😴"
      mood = 'calm'
    }
    else {
      // Default empathetic responses
      const defaultResponses = [
        "That's really interesting! Tell me more about that. 💫",
        "I appreciate you sharing that with me. 🌟",
        "How does that make you feel? 🎭",
        "I'm here to listen whenever you need to talk. 🌙",
        "That sounds important. Would you like to explore that further? 🔍",
        "I understand. Sometimes it helps to talk things through. 💭"
      ]
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    }

    const aiMessage = {
      id: Date.now(),
      text: response,
      sender: 'pet',
      timestamp: new Date(),
      mood: mood
    }

    setMessages(prev => [...prev, aiMessage])
    setConversationHistory(prev => [...prev, aiMessage])
    
    // Update pet mood if it changed
    if (mood !== pet.mood) {
      onMoodChange?.(mood)
    }
    
    setIsTyping(false)
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setConversationHistory(prev => [...prev, userMessage])
    setInputMessage('')

    simulateAIResponse(inputMessage)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'from-yellow-400 to-amber-400',
      calm: 'from-green-400 to-emerald-400',
      excited: 'from-pink-400 to-rose-400',
      sad: 'from-blue-400 to-cyan-400',
      neutral: 'from-gray-400 to-gray-500'
    }
    return colors[mood] || colors.neutral
  }

  const quickReplies = [
    "How are you feeling?",
    "Want to play?",
    "Let's meditate",
    "You're amazing!",
    "Time for a break?"
  ]

  return (
    <div className="glass-morphism rounded-xl overflow-hidden h-[500px] flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getMoodColor(pet.mood)} p-4 text-white`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">{pet.name}</h3>
            <p className="text-white/80 text-sm">AI Companion</p>
          </div>
          <div className="flex-1" />
          <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {pet.mood}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'pet' ? (
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center text-xs font-bold text-primary">
                    {pet.name[0]}
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-2">
                    <p className="text-white text-sm">{message.text}</p>
                    <div className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-[80%]">
                  <div className="bg-accent-teal text-primary rounded-2xl rounded-tr-none px-4 py-2">
                    <p className="text-sm">{message.text}</p>
                    <div className="text-xs text-primary/70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center text-xs font-bold text-primary">
              {pet.name[0]}
            </div>
            <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-accent-mint rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-accent-mint rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-accent-mint rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 border-t border-white/10">
        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
          {quickReplies.map((reply, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setInputMessage(reply)
                setTimeout(() => handleSendMessage(), 100)
              }}
              className="flex-shrink-0 bg-white/5 hover:bg-white/10 text-white text-xs px-3 py-2 rounded-full transition-colors whitespace-nowrap"
            >
              {reply}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Chat with ${pet.name}...`}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-accent-teal transition-colors pr-12"
              maxLength={200}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {inputMessage.length}/200
            </div>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-accent-teal hover:bg-accent-mint text-primary p-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIPetCompanion