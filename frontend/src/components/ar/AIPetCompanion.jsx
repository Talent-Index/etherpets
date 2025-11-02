import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Brain, Heart, Zap, Sparkles, User } from 'lucide-react'
import apiClient from '../../utils/api'

const AIPetCompanion = ({ pet, onMoodChange }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])
  const inputRef = useRef(null);
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
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Call the backend for an AI response
    const response = await apiClient.post(`/pets/${pet.id}/chat`, {
      message: userMessage,
      history: conversationHistory,
    });

    const { reply, newMood } = response.data;

    const aiMessage = {
      id: Date.now(),
      text: reply,
      sender: 'pet',
      timestamp: new Date(),
      mood: newMood
    }

    setMessages(prev => [...prev, aiMessage])
    setConversationHistory(prev => [...prev, aiMessage])
    
    if (newMood !== pet.mood) {
      onMoodChange?.(newMood)
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
    setInputMessage('');

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
                setInputMessage(reply);
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
              ref={inputRef}
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