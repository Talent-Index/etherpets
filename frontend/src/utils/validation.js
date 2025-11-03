/**
 * Validation utilities for form inputs and user data
 * Provides validation functions for common input types
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validates Ethereum address format
 * @param {string} address - Ethereum address to validate
 * @returns {boolean} True if address is valid
 */
export const validateEthereumAddress = (address) => {
  if (!address || typeof address !== 'string') return false
  
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validates username
 * @param {string} username - Username to validate
 * @param {number} minLength - Minimum length (default: 3)
 * @param {number} maxLength - Maximum length (default: 20)
 * @returns {Object} Validation result with isValid and error message
 */
export const validateUsername = (username, minLength = 3, maxLength = 20) => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, error: 'Username is required' }
  }
  
  const trimmed = username.trim()
  
  if (trimmed.length < minLength) {
    return { isValid: false, error: `Username must be at least ${minLength} characters` }
  }
  
  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Username must be less than ${maxLength} characters` }
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates pet name
 * @param {string} name - Pet name to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validatePetName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Pet name is required' }
  }
  
  const trimmed = name.trim()
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Pet name must be at least 2 characters' }
  }
  
  if (trimmed.length > 30) {
    return { isValid: false, error: 'Pet name must be less than 30 characters' }
  }
  
  if (!/^[a-zA-Z0-9\s'-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Pet name contains invalid characters' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates numeric input within a range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {Object} Validation result with isValid and error message
 */
export const validateNumberRange = (value, min, max) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: 'Value must be a number' }
  }
  
  if (value < min) {
    return { isValid: false, error: `Value must be at least ${min}` }
  }
  
  if (value > max) {
    return { isValid: false, error: `Value must be at most ${max}` }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates a URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') return false
  
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Sanitizes user input by removing potentially harmful characters
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .slice(0, 1000) // Limit length
}

/**
 * Validates text length
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {Object} Validation result
 */
export const validateTextLength = (text, minLength, maxLength) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Text is required' }
  }
  
  const trimmed = text.trim()
  
  if (trimmed.length < minLength) {
    return { isValid: false, error: `Text must be at least ${minLength} characters` }
  }
  
  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Text must be less than ${maxLength} characters` }
  }
  
  return { isValid: true, error: null }
}
