/**
 * Formats an Ethereum address for display by shortening it.
 * e.g., "0x1234567890abcdef1234567890abcdef12345678" -> "0x1234...5678"
 * @param {string} address - The full Ethereum address.
 * @param {number} [startLength=6] - The number of characters to show from the beginning of the address.
 * @param {number} [endLength=4] - The number of characters to show from the end of the address.
 * @returns {string} The formatted, shortened address.
 */
export const formatAddress = (address, startLength = 6, endLength = 4) => {
  if (!address || typeof address !== 'string') return ''
  if (address.length <= startLength + endLength) return address
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Formats a duration in seconds into a MM:SS time format.
 * @param {number} seconds - The total number of seconds.
 * @returns {string} The formatted time string (e.g., "05:30").
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Formats a date string or Date object into a readable string.
 * @param {string | Date} dateString - The ISO date string or Date object to format.
 * @param {Intl.DateTimeFormatOptions} [options={}] - Optional `Intl.DateTimeFormat` options.
 * @returns {string} The formatted date string.
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
 * Formats a date into a relative time string (e.g., "2 hours ago").
 * @param {string | Date} dateString - The ISO date string or Date object.
 * @returns {string} The relative time string (e.g., "just now", "5 minutes ago").
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
 * Formats large numbers into a compact format with suffixes (K, M, B).
 * @param {number} number - The number to format.
 * @returns {string} The formatted number as a string (e.g., "1.2K", "3.4M").
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
 * Formats an energy value as a percentage string.
 * @param {number} energy - The energy value (expected to be between 0 and 100).
 * @returns {string} The formatted energy string with a '%' symbol.
 */
export const formatEnergy = (energy) => {
  if (typeof energy !== 'number' || isNaN(energy)) return '0%'
  return `${Math.round(energy)}%`
}

/**
 * Formats a token amount with a given symbol and decimal precision.
 * @param {number} amount - The amount of tokens.
 * @param {string} [symbol='HMY'] - The symbol of the token.
 * @param {number} [decimals=2] - The number of decimal places to display.
 * @returns {string} The formatted token amount string (e.g., "1,234.56 HMY").
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
 * Capitalizes the first letter of a string and converts the rest to lowercase.
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Formats a file size in bytes into a human-readable string (e.g., "1.23 KB").
 * @param {number} bytes - The file size in bytes.
 * @param {number} [decimals=2] - The number of decimal places for the result.
 * @returns {string} The formatted file size string.
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}