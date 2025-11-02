/**
 * User Context for managing user state and pet data
 * Handles pet creation, updates, and local storage persistence
 */
import React, { createContext, useContext, useState } from 'react'
import { useGameState } from './GameStateContext'
import useLocalStorage from '../hooks/useLocalStorage'

// Create context for user data
const UserContext = createContext()

/**
 * Custom hook to access user context
 * @returns {Object} User context value
 */
export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('etherpets-user', null)
  const [pets, setPets] = useLocalStorage('etherpets-pets', [])
  const [currentPet, setCurrentPet] = useLocalStorage('etherpets-current-pet', null)
  const [isLoading, setIsLoading] = useState(false)
  const { addEnergy, addTokens, addNotification } = useGameState()

  /**
   * Create a new pet for the user
   * @param {Object} petData - The pet data to create
   * @returns {Promise<Object>} The created pet
   */
  const createPet = async (petData) => {
    setIsLoading(true)
    try {
      const newPet = {
        id: Date.now().toString(),
        ...petData,
        createdAt: new Date().toISOString(),
        mood: 'happy',
        energy: 50,
        happiness: 50,
        level: 1,
        experience: 0,
        lastAction: new Date().toISOString()
      }

      setPets([newPet])
      setCurrentPet(newPet)

      // Add rewards for creating a pet
      addEnergy(20)
      addTokens(50)
      addNotification({
        type: 'pet',
        message: `Welcome ${newPet.name}! Your new companion is ready to grow with you.`,
        read: false
      })

      return newPet
    } catch (error) {
      console.error('Error creating pet:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Update pet data
   * @param {string} petId - The ID of the pet to update
   * @param {Object} updates - The updates to apply
   * @returns {Promise<boolean>} Success status
   */
  const updatePet = async (petId, updates) => {
    setPets(prev => prev.map(pet => 
      pet.id === petId ? { ...pet, ...updates } : pet
    ))
    
    if (currentPet?.id === petId) {
      setCurrentPet(prev => ({ ...prev, ...updates }))
    }

    return true
  }

  /**
   * Update pet mood
   * @param {string} petId - The ID of the pet
   * @param {string} newMood - The new mood value
   * @returns {Promise<boolean>} Success status
   */
  const updatePetMood = (petId, newMood) => {
    return updatePet(petId, { 
      mood: newMood, 
      lastAction: new Date().toISOString() 
    })
  }

  /**
   * Perform an action on a pet (feed, play, rest, meditate)
   * @param {string} petId - The ID of the pet
   * @param {string} actionType - The type of action to perform
   * @returns {Promise<boolean>} Success status
   */
  const performPetAction = async (petId, actionType) => {
    if (!currentPet) return false

    // Define effects for each action type
    const actionEffects = {
      feed: { 
        energy: Math.min(currentPet.energy + 20, 100), 
        happiness: Math.min(currentPet.happiness + 10, 100),
        mood: 'happy'
      },
      play: { 
        energy: Math.max(currentPet.energy - 10, 0), 
        happiness: Math.min(currentPet.happiness + 20, 100),
        mood: 'excited'
      },
      rest: { 
        energy: Math.min(currentPet.energy + 30, 100), 
        mood: 'calm'
      },
      meditate: { 
        happiness: Math.min(currentPet.happiness + 15, 100), 
        mood: 'calm'
      }
    }

    const effects = actionEffects[actionType] || {}
    const success = await updatePet(petId, { 
      ...effects, 
      lastAction: new Date().toISOString() 
    })

    if (success) {
      // Add small energy reward for interacting with pet
      addEnergy(5)
      addNotification({
        type: 'pet',
        message: `${currentPet.name} enjoyed the ${actionType}!`,
        read: false
      })
    }

    return success
  }

  /**
   * Level up a pet when it gains enough experience
   * @param {string} petId - The ID of the pet to level up
   */
  const levelUpPet = (petId) => {
    setPets(prev => prev.map(pet => {
      if (pet.id === petId) {
        const newLevel = pet.level + 1
        return {
          ...pet,
          level: newLevel,
          energy: 100,
          happiness: 100,
          experience: 0
        }
      }
      return pet
    }))

    if (currentPet?.id === petId) {
      setCurrentPet(prev => ({
        ...prev,
        level: prev.level + 1,
        energy: 100,
        happiness: 100,
        experience: 0
      }))
    }

    addNotification({
      type: 'level',
      message: `${currentPet?.name} reached level ${currentPet?.level + 1}!`,
      read: false
    })
  }

  /**
   * Switch the currently active pet
   * @param {string} petId - The ID of the pet to switch to
   */
  const switchPet = (petId) => {
    const pet = pets.find(p => p.id === petId)
    if (pet) {
      setCurrentPet(pet)
    }
  }

  // Context value containing all user-related state and functions
  const value = {
    user,
    setUser,
    pets,
    currentPet,
    setCurrentPet,
    createPet,
    updatePet,
    updatePetMood,
    performPetAction,
    levelUpPet,
    switchPet,
    isLoading
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}