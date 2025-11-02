import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, Brain, Heart, Zap } from 'lucide-react'

const VoiceCommands = ({ onCommand, pet }) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [lastCommand, setLastCommand] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript || interimTranscript)
        
        // Process command when we have final transcript
        if (finalTranscript) {
          processCommand(finalTranscript.toLowerCase())
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Restart recognition if we're still supposed to be listening
          recognitionRef.current.start()
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const processCommand = (command) => {
    const commands = {
      'feed': { action: 'feed', response: `Feeding ${pet?.name}` },
      'play': { action: 'play', response: `Playing with ${pet?.name}` },
      'rest': { action: 'rest', response: `Letting ${pet?.name} rest` },
      'meditate': { action: 'meditate', response: `Starting meditation with ${pet?.name}` },
      'hello': { action: 'greet', response: `Hello! ${pet?.name} is happy to see you` },
      'how are you': { action: 'status', response: `${pet?.name} is feeling great!` },
      'good job': { action: 'praise', response: `Thank you! ${pet?.name} appreciates the praise` }
    }

    const matchedCommand = Object.entries(commands).find(([key]) => 
      command.includes(key)
    )

    if (matchedCommand) {
      const [key, { action, response }] = matchedCommand
      setLastCommand(response)
      onCommand?.(action)
      
      // Clear last command after 3 seconds
      setTimeout(() => setLastCommand(''), 3000)
    }
  }

  const toggleListening = () => {
    if (!isSupported) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const getAvailableCommands = () => [
    { command: 'Feed', description: 'Give your pet some energy', icon: '🍎' },
    { command: 'Play', description: 'Play with your pet', icon: '🎾' },
    { command: 'Rest', description: 'Let your pet take a break', icon: '😴' },
    { command: 'Meditate', description: 'Start a meditation session', icon: '🧘' },
    { command: 'Hello', description: 'Greet your pet', icon: '👋' },
    { command: 'How are you', description: 'Check on your pet', icon: '💭' }
  ]

  if (!isSupported) {
    return (
      <div className="glass-morphism p-6 rounded-xl text-center">
        <MicOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Voice Not Supported</h3>
        <p className="text-gray-400 text-sm">
          Voice commands are not supported in your browser. 
          Try using Chrome or Edge for this feature.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-morphism p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Mic className="w-5 h-5 text-accent-cyan" />
          <span>Voice Commands</span>
        </h3>
        
        <div className={`w-3 h-3 rounded-full ${
          isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
        }`} />
      </div>

      {/* Voice Status */}
      <AnimatePresence>
        {lastCommand && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-accent-teal/20 border border-accent-teal/30 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-accent-teal" />
              <span className="text-accent-teal font-medium">{lastCommand}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript Display */}
      <div className="bg-white/5 rounded-lg p-4 mb-4 min-h-16">
        {transcript ? (
          <p className="text-gray-300 text-sm">{transcript}</p>
        ) : (
          <p className="text-gray-400 text-sm text-center">
            {isListening ? 'Listening... Speak a command' : 'Press the microphone to start'}
          </p>
        )}
      </div>

      {/* Voice Control Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-accent-teal hover:bg-accent-mint text-primary'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-6 h-6" />
            <span>Stop Listening</span>
          </>
        ) : (
          <>
            <Mic className="w-6 h-6" />
            <span>Start Voice Commands</span>
          </>
        )}
      </motion.button>

      {/* Available Commands */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center space-x-2">
          <Brain className="w-4 h-4" />
          <span>Available Commands</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          {getAvailableCommands().map((cmd, index) => (
            <motion.div
              key={cmd.command}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-3 text-center"
            >
              <div className="text-lg mb-1">{cmd.icon}</div>
              <div className="text-xs font-medium text-white">{cmd.command}</div>
              <div className="text-xs text-gray-400 mt-1">{cmd.description}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-accent-cyan/10 border border-accent-cyan/20 rounded-lg"
      >
        <p className="text-xs text-accent-cyan text-center">
          💡 Try natural phrases like "Hey, let's play!" or "Can we meditate?"
        </p>
      </motion.div>
    </div>
  )
}

export default VoiceCommands