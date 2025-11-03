/**
 * Animation presets for Framer Motion
 * Provides reusable animation configurations for consistent UI motion
 */

/**
 * Fade in animation
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
}

/**
 * Slide in from left animation
 */
export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

/**
 * Slide in from right animation
 */
export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

/**
 * Slide in from top animation
 */
export const slideInTop = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

/**
 * Slide in from bottom animation
 */
export const slideInBottom = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

/**
 * Scale in animation (pop effect)
 */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.3, ease: 'easeOut' }
}

/**
 * Scale bounce animation
 */
export const scaleBounce = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    type: 'spring',
    stiffness: 260,
    damping: 20
  }
}

/**
 * Rotate in animation
 */
export const rotateIn = {
  initial: { opacity: 0, rotate: -180 },
  animate: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: 180 },
  transition: { duration: 0.5, ease: 'easeInOut' }
}

/**
 * Stagger container for child animations
 */
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

/**
 * Stagger item (use with staggerContainer)
 */
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

/**
 * Pulse animation (breathing effect)
 */
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}

/**
 * Float animation (gentle up and down)
 */
export const float = {
  animate: {
    y: [0, -10, 0]
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}

/**
 * Shake animation (for errors or emphasis)
 */
export const shake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0]
  },
  transition: {
    duration: 0.5
  }
}

/**
 * Glow animation (pulsing glow effect)
 */
export const glow = {
  animate: {
    boxShadow: [
      '0 0 5px rgba(16, 185, 129, 0.5)',
      '0 0 20px rgba(16, 185, 129, 0.8)',
      '0 0 5px rgba(16, 185, 129, 0.5)'
    ]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}

/**
 * Expand animation (for accordions or dropdowns)
 */
export const expand = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' }
}

/**
 * Modal animation (backdrop + content)
 */
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
  transition: { duration: 0.3, ease: 'easeOut' }
}

/**
 * Page transition animations
 */
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.4, ease: 'easeInOut' }
}

/**
 * Card hover animation
 */
export const cardHover = {
  whileHover: {
    y: -5,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    transition: { duration: 0.2 }
  },
  whileTap: { scale: 0.98 }
}

/**
 * Button hover animation
 */
export const buttonHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 }
}

/**
 * Icon bounce animation
 */
export const iconBounce = {
  whileHover: {
    y: [0, -5, 0],
    transition: {
      duration: 0.5,
      repeat: 2
    }
  }
}
