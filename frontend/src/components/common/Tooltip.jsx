/**
 * Tooltip Component
 * Displays contextual information when hovering over elements
 */
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

/**
 * Tooltip Component
 */
const Tooltip = ({ 
  content, 
  children, 
  position = 'top',
  delay = 200,
  maxWidth = 200,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef(null)
  const timeoutRef = useRef(null)

  /**
   * Calculate tooltip position based on trigger element
   */
  const calculatePosition = () => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const scrollX = window.pageXOffset
    const scrollY = window.pageYOffset

    switch (position) {
      case 'top':
        return {
          x: rect.left + scrollX + (rect.width / 2),
          y: rect.top + scrollY - 8
        }
      case 'bottom':
        return {
          x: rect.left + scrollX + (rect.width / 2),
          y: rect.bottom + scrollY + 8
        }
      case 'left':
        return {
          x: rect.left + scrollX - 8,
          y: rect.top + scrollY + (rect.height / 2)
        }
      case 'right':
        return {
          x: rect.right + scrollX + 8,
          y: rect.top + scrollY + (rect.height / 2)
        }
      default:
        return { x: rect.left + scrollX, y: rect.top + scrollY }
    }
  }

  /**
   * Show tooltip with delay
   */
  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      const newCoords = calculatePosition()
      setCoords(newCoords)
      setIsVisible(true)
    }, delay)
  }

  /**
   * Hide tooltip immediately
   */
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  /**
   * Get tooltip position classes
   */
  const getPositionClasses = () => {
    const baseClasses = 'absolute transform -translate-x-1/2 -translate-y-1/2 z-50'
    
    switch (position) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 mb-2`
      case 'bottom':
        return `${baseClasses} top-full left-1/2 -translate-x-1/2 mt-2`
      case 'left':
        return `${baseClasses} right-full top-1/2 -translate-y-1/2 mr-2`
      case 'right':
        return `${baseClasses} left-full top-1/2 -translate-y-1/2 ml-2`
      default:
        return baseClasses
    }
  }

  return (
    <div 
      ref={triggerRef}
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={getPositionClasses()}
            style={{ maxWidth }}
          >
            {/* Tooltip Content */}
            <div className="glass-morphism rounded-lg p-3 border border-white/20 shadow-xl">
              <p className="text-sm text-white leading-relaxed">
                {content}
              </p>
              
              {/* Tooltip Arrow */}
              <div className={`absolute w-2 h-2 bg-white/10 border-r border-b border-white/20 transform rotate-45 ${
                position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
                position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
                position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
                'left-[-4px] top-1/2 -translate-y-1/2'
              }`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Simple Help Icon with Tooltip
 */
export const HelpTooltip = ({ content, position = 'top', className = '' }) => {
  return (
    <Tooltip content={content} position={position} className={className}>
      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
    </Tooltip>
  )
}

/**
 * Info Badge with Tooltip
 */
export const InfoBadge = ({ content, position = 'top', className = '' }) => {
  return (
    <Tooltip content={content} position={position} className={className}>
      <div className="w-5 h-5 bg-accent-cyan/20 rounded-full flex items-center justify-center cursor-help">
        <span className="text-accent-cyan text-xs font-bold">i</span>
      </div>
    </Tooltip>
  )
}

export default Tooltip