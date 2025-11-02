/**
 * Toast Notification Component
 * Displays temporary notifications for user actions and system events
 */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  AlertTriangle 
} from 'lucide-react'

/**
 * Toast Types Configuration
 */
const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    borderColor: 'border-green-400/30'
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
    borderColor: 'border-red-400/30'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
    borderColor: 'border-yellow-400/30'
  },
  info: {
    icon: Info,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20',
    borderColor: 'border-blue-400/30'
  }
}

/**
 * Toast Component
 */
const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000,
  onClose,
  id 
}) => {
  const [isVisible, setIsVisible] = React.useState(true)
  const toastConfig = TOAST_TYPES[type] || TOAST_TYPES.info
  const Icon = toastConfig.icon

  /**
   * Auto-dismiss toast after duration
   */
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(id), 300) // Wait for animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, id, onClose])

  /**
   * Handle manual close
   */
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(id), 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center space-x-3 p-4 rounded-xl border ${toastConfig.bgColor} ${toastConfig.borderColor} shadow-lg min-w-80 max-w-md`}
        >
          {/* Icon */}
          <Icon className={`w-5 h-5 ${toastConfig.color}`} />

          {/* Message */}
          <div className="flex-1">
            <p className="text-sm text-white font-medium">{message}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Progress Bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-30 origin-left rounded-b-xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Toast Container Component
 * Manages multiple toast notifications
 */
export const ToastContainer = () => {
  const [toasts, setToasts] = React.useState([])

  /**
   * Add a new toast
   */
  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }

  /**
   * Remove a toast
   */
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  /**
   * Clear all toasts
   */
  const clearAll = () => {
    setToasts([])
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Hook for using toast notifications
 */
export const useToast = () => {
  const [container, setContainer] = React.useState(null)

  React.useEffect(() => {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container')
    if (!toastContainer) {
      toastContainer = document.createElement('div')
      toastContainer.id = 'toast-container'
      document.body.appendChild(toastContainer)
    }
    setContainer(toastContainer)
  }, [])

  const showToast = (message, type = 'info', duration = 5000) => {
    // This would be implemented with a proper state management solution
    // For now, we'll use a simple event-based system
    const event = new CustomEvent('showToast', {
      detail: { message, type, duration }
    })
    window.dispatchEvent(event)
  }

  return {
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration)
  }
}

export default Toast