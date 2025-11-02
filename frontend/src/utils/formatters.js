/**
 * Formatter utilities for consistent data formatting across the application
 * Includes date, time, numbers, addresses, and currency formatting
 */

/**
 * Format Ethereum address for display
 * @param {string} address - Full Ethereum address
 * @param {number} startLength - Number of characters to show at start
 * @param {number} endLength - Number of characters to show at end
 * @returns {string} Formatted address (e.g., "0x1234...5678")
 */
export const formatAddress = (address, startLength = 6, endLength = 4) => {
  if (!address || typeof address !== 'string') return ''
  if (address.length <= startLength + endLength) return address
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Format seconds into MM:SS time format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string (e.g., "05:30")
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format date into readable string
 * @param {string|Date} dateString - ISO date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options })
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return formatDate(dateString)
  }
}

/**
 * Format large numbers with K/M/B suffixes
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  if (typeof number !== 'number' || isNaN(number)) return '0'
  
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B'
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K'
  } else {
    return number.toString()
  }
}

/**
 * Format energy values with percentage
 * @param {number} energy - Energy value (0-100)
 * @returns {string} Formatted energy string
 */
export const formatEnergy = (energy) => {
  if (typeof energy !== 'number' || isNaN(energy)) return '0%'
  return `${Math.round(energy)}%`
}

/**
 * Format token amount with symbol
 * @param {number} amount - Token amount
 * @param {string} symbol - Token symbol (default: 'HMY')
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted token amount
 */
export const formatTokens = (amount, symbol = 'HMY', decimals = 2) => {
  if (typeof amount !== 'number' || isNaN(amount)) return `0 ${symbol}`
  
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  })
  
  return `${formattedAmount} ${symbol}`
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in