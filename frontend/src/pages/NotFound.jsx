/**
 * 404 Not Found Page
 * Displayed when users navigate to non-existent routes
 */
import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, Search, Ghost } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md"
      >
        {/* Animated Ghost Icon */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center mx-auto">
            <Ghost className="w-16 h-16 text-primary" />
          </div>
        </motion.div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-accent-mint mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Oops! The page you're looking for has vanished into the digital ether. 
          It might have been moved, deleted, or never existed in the first place.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-white/5 rounded-xl"
        >
          <h3 className="text-sm font-semibold text-accent-cyan mb-2">
            Looking for something?
          </h3>
          <ul className="text-xs text-gray-400 space-y-1 text-left">
            <li>• Check the URL for typos</li>
            <li>• Use the navigation menu to explore</li>
            <li>• Visit your Dashboard to continue your journey</li>
            <li>• Contact support if you need help</li>
          </ul>
        </motion.div>

        {/* Fun Easter Egg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6"
        >
          <p className="text-xs text-gray-500">
            Your digital pet is still waiting for you! 🐾
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound