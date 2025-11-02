/**
 * Notification Center Component
 * Displays user notifications with read/unread status and actions
 */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, Trash2, Zap, Heart, Users } from 'lucide-react'
import { useGameState } from '../../context/GameStateContext'

const NotificationCenter = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications,
    getUnreadNotificationsCount 
  } = useGameState()
  
  const [isOpen, setIsOpen] = useState(false)

  /**
   * Get icon for notification type
   * @param {string} type - Notification type
   * @returns {JSX.Element} Icon component
   */
  const getNotificationIcon = (type) => {
    const icons = {
      energy: <Zap className="w-4 h-4 text-yellow-400" />,
      social: <Users className="w-4 h-4 text-blue-400" />,
      pet: <Heart className="w-4 h-4 text-red-400" />,
      garden: <Zap className="w-4 h-4 text-green-400" />,
      level: <Zap className="w-4 h-4 text-purple-400" />,
      game: <Zap className="w-4 h-4 text-orange-400" />
    }
    return icons[type] || <Bell className="w-4 h-4 text-gray-400" />
  }

  /**
   * Format notification timestamp
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Formatted time
   */
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id)
      }
    })
  }

  const unreadCount = getUnreadNotificationsCount()

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-12 w-80 sm:w-96 glass-morphism rounded-xl shadow-2xl z-50 border border-white/10"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-accent-cyan" />
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-accent-teal text-primary text-xs px-2 py-1 rounded-full font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="p-1 text-gray-400 hover:text-accent-mint transition-colors"
                        title="Mark all as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={clearAllNotifications}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Clear all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    <AnimatePresence>
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-accent-teal/5' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Notification Icon */}
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            {/* Notification Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                            
                            {/* Unread Indicator */}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-accent-mint rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-white/10">
                  <button
                    onClick={clearAllNotifications}
                    className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors py-2"
                  >
                    Clear all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationCenter