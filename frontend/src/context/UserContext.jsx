import React, { createContext, useContext, useState, useEffect } from 'react'
import { useGameState } from './GameStateContext'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [pets, setPets] = useState([])
  const [currentPet, setCurrentPet] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { addEnergy, addTokens, addNotification } = useGameState()

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      try {
        const savedUser = localStorage.getItem('etherpets-user')
        const savedPets = localStorage.getItem('etherpets-pets')
        const savedCurrentPet = localStorage.getItem('etherpets-current-pet')

        if (savedUser) setUser(JSON.parse(savedUser))
        if (savedPets) setPets(JSON.parse(savedPets))
        if (savedCurrentPet) setCurrentPet(JSON.parse(savedCurrentPet))
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Save user data to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('etherpets-user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('etherpets-pets', JSON.stringify(pets))
  }, [pets])

  useEffect(() => {
    if (currentPet) localStorage.setItem('etherpets-current-pet', JSON.stringify(currentPet))
  }, [currentPet])

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

  const updatePet = async (petId, updates) => {
    setPets(prev => prev.map(pet => 
      pet.id === petId ? { ...pet, ...updates } : pet
    ))
    
    if (currentPet?.id === petId) {
      setCurrentPet(prev => ({ ...prev, ...updates }))
    }

    return true
  }

  const updatePetMood = (petId, newMood) => {
    return updatePet(petId, { mood: newMood, lastAction: new Date().toISOString() })
  }

  const performPetAction = async (petId, actionType) => {
    if (!currentPet) return false

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

  const switchPet = (petId) => {
    const pet = pets.find(p => p.id === petId)
    if (pet) {
      setCurrentPet(pet)
    }
  }

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