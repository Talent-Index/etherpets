/**
 * Theme Context for managing application theme and dark mode
 * Provides theme switching functionality and persistent theme storage
 */
import React, { createContext, useContext, useState, useEffect } from 'react'

// Theme options
const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  AUTO: 'auto'
}

// Create context for theme data
const ThemeContext = createContext()

/**
 * Custom hook to access theme context
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.DARK)
  const [isDark, setIsDark] = useState(true)

  /**
   * Initialize theme from localStorage or system preference
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('etherpets-theme')
    
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      // Default to dark theme for EtherPets
      setTheme(THEMES.DARK)
      localStorage.setItem('etherpets-theme', THEMES.DARK)
    }
  }, [])

  /**
   * Apply theme changes to document and state
   */
  useEffect(() => {
    const applyTheme = () => {
      let effectiveTheme = theme

      if (theme === THEMES.AUTO) {
        // Use system preference for auto theme
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? THEMES.DARK 
          : THEMES.LIGHT
      }

      // Update document class
      if (effectiveTheme === THEMES.DARK) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
        setIsDark(true)
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
        setIsDark(false)
      }

      // Save to localStorage
      localStorage.setItem('etherpets-theme', theme)
    }

    applyTheme()

    // Listen for system theme changes when in auto mode
    if (theme === THEMES.AUTO) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme()
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  // Context value containing all theme-related state and functions
  const value = {
    theme,
    isDark,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}