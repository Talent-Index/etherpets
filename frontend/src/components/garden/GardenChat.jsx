import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Users, Heart, Zap } from 'lucide-react'

const GardenChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Luna',
      text: 'Just completed the breathing exercise! Feeling so calm 🌿',
      timestamp: new Date(Date.now() - 300000),
      type: 'message',
      userColor: 'from-purple-500 to-pink-500'
    },
    {
      id: 2,
      user: 'Orion',
      text: 'Anyone want to collaborate on the center puzzle?',
      timestamp: new Date(Date.now() - 180000),
      type: 'message',
      userColor: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      user: 'System',
      text: 'Stella solved the Reflection Node! +5 energy for the garden 🌸',
      timestamp: new Date(Date.now() - 120000),
      type: 'system'
    },
    {
      id: 4,
      user: 'Nova',
      text: 'The meditation ritual really helped me focus today',
      timestamp: new Date(Date.now() - 60000),
      type: 'message',
      userColor: 'from-green-500 to-emerald-500'
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [activeUsers, setActiveUsers] = useState([
    { name: 'Luna', status: 'active', pet: 'Glow Fox' },
    { name: 'Orion', status: 'active', pet: 'Star Cat' },
    { name: 'Stella', status: 'away', pet: 'Moon Rabbit' },
    { name: 'Nova', status: 'active', pet: 'Sun Bird' },
    { name: 'Cosmo', status: 'away', pet: 'Comet Dog' }
  ])
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      user: 'You',
      text: newMessage,
      timestamp: new Date(),
      type: 'message',
      userColor: 'from-accent-cyan to-accent-teal'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const sendQuickReaction = (reaction) => {
    const message = {
      id: messages.length + 1,
      user: 'You',
      text: reaction,
      timestamp: new Date(),
      type: 'reaction',
      userColor: 'from-accent-cyan to-accent-teal'
    }
    setMessages(prev => [...prev, message])
  }

  return (
    <div className="h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-accent-lavender" />
          <div>
            <h3 className="font-semibold">Garden Chat</h3>
            <p className="text-sm text-gray-400">Connect with your garden mates</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-accent-mint rounded-full"></div>
          <span>{activeUsers.filter(u => u.status === 'active').length} active</span>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${
                    message.user === 'You' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'system' ? (
                    <div className="text-center">
                      <div className="inline-block bg-accent-teal/20 text-accent-teal text-sm px-4 py-2 rounded-xl">
                        {message.text}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  ) : message.type === 'reaction' ? (
                    <div className="bg-accent-cyan/20 text-accent-cyan text-lg px-4 py-2 rounded-xl">
                      {message.text}
                    </div>
                  ) : (
                    <div className={`max-w-xs lg:max-w-md ${
                      message.user === 'You' ? 'text-right' : ''
                    }`}>
                      {message.user !== 'You' && (
                        <div className="flex items-center space-x-2 mb-1">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${message.userColor}`}></div>
                          <span className="text-sm font-medium text-gray-300">
                            {message.user}
                          </span>
                        </div>
                      )}
                      <div className={`inline-block px-4 py-2 rounded-2xl ${
                        message.user === 'You'
                          ? 'bg-accent-teal text-primary'
                          : 'bg-white/10 text-white'
                      }`}>
                        {message.text}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reactions */}
          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2 mb-3">
              {['🌿', '🌸', '💫', '😊', '🌙'].map((reaction) => (
                <button
                  key={reaction}
                  onClick={() => sendQuickReaction(reaction)}
                  className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-lg"
                >
                  {reaction}
                </button>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message to your garden mates..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-accent-teal transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-accent-teal hover:bg-accent-mint text-primary p-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Online Users Sidebar */}
        <div className="w-64 border-l border-white/10 p-4 hidden lg:block">
          <h4 className="font-semibold mb-4">Garden Members</h4>
          <div className="space-y-3">
            {activeUsers.map((user, index) => (
              <div key={user.name} className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full border-2 border-primary absolute -right-1 -bottom-1 ${
                    user.status === 'active' ? 'bg-accent-mint' : 'bg-gray-500'
                  }`}></div>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                    index % 3 === 0 ? 'from-purple-500 to-pink-500' :
                    index % 3 === 1 ? 'from-blue-500 to-cyan-500' :
                    'from-green-500 to-emerald-500'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{user.name}</div>
                  <div className="text-xs text-gray-400 truncate">{user.pet}</div>
                </div>
                {user.status === 'active' && (
                  <Zap className="w-4 h-4 text-accent-cyan" />
                )}
              </div>
            ))}
          </div>

          {/* Garden Stats */}
          <div className="mt-6 p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Today's Energy</span>
              <span className="text-accent-cyan font-semibold">85%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-accent-cyan to-accent-mint rounded-full transition-all duration-1000"
                style={{ width: '85%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GardenChat