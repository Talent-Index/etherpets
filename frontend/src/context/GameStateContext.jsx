import React, { createContext, useContext, useState, useEffect } from 'react'

const GameStateContext = createContext()

export const useGameState = () => {
  const context = useContext(GameStateContext)
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
}

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    energy: 75,
    tokens: 1250,
    streak: 7,
    lastPlayed: new Date().toISOString(),
    gardenProgress: 11,
    achievements: [
      { id: 1, name: 'First Steps', earned: true },
      { id: 2, name: 'Mindful Beginner', earned: true },
      { id: 3, name: 'Garden Guardian', earned: true },
      { id: 4, name: 'Energy Master', earned: false }
    ],
    dailyRituals: {
      breathing: { completed: true, energy: 5 },
      reflection: { completed: false, energy: 8 },
      social: { completed: false, energy: 10 }
    }
  })

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'energy', message: '+5 energy from morning meditation', read: false },
    { id: 2, type: 'social', message: 'Luna sent you positive energy', read: false },
    { id: 3, type: 'garden', message: 'New puzzle available in Harmony Garden', read: true }
  ])

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedGameState = localStorage.getItem('etherpets-game-state')
    if (savedGameState) {
      setGameState(JSON.parse(savedGameState))
    }

    const savedNotifications = localStorage.getItem('etherpets-notifications')
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [])

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('etherpets-game-state', JSON.stringify(gameState))
  }, [gameState])

  useEffect(() => {
    localStorage.setItem('etherpets-notifications', JSON.stringify(notifications))
  }, [notifications])

  const addEnergy = (amount) => {
    setGameState(prev => ({
      ...prev,
      energy: Math.min(prev.energy + amount, 100)
    }))
  }

  const spendEnergy = (amount) => {
    setGameState(prev => ({
      ...prev,
      energy: Math.max(prev.energy - amount, 0)
    }))
  }

  const addTokens = (amount) => {
    setGameState(prev => ({
      ...prev,
      tokens: prev.tokens + amount
    }))
  }

  const spendTokens = (amount) => {
    setGameState(prev => ({
      ...prev,
      tokens: Math.max(prev.tokens - amount, 0)
    }))
  }

  const incrementStreak = () => {
    setGameState(prev => ({
      ...prev,
      streak: prev.streak + 1,
      lastPlayed: new Date().toISOString()
    }))
  }

  const completeRitual = (ritualType) => {
    setGameState(prev => ({
      ...prev,
      dailyRituals: {
        ...prev.dailyRituals,
        [ritualType]: { ...prev.dailyRituals[ritualType], completed: true }
      }
    }))

    const energyReward = gameState.dailyRituals[ritualType]?.energy || 5
    addEnergy(energyReward)
    addTokens(energyReward * 2)
  }

  const updateGardenProgress = (progress) => {
    setGameState(prev => ({
      ...prev,
      gardenProgress: Math.min(prev.gardenProgress + progress, 100)
    }))
  }

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getUnreadNotificationsCount = () => {
    return notifications.filter(notification => !notification.read).length
  }

  const value = {
    gameState,
    notifications,
    addEnergy,
    spendEnergy,
    addTokens,
    spendTokens,
    incrementStreak,
    completeRitual,
    updateGardenProgress,
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,
    getUnreadNotificationsCount
  }

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  )
}