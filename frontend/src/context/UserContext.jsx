import React, { createContext, useContext, useState, useEffect } from 'react'

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

  const createPet = async (petData) => {
    setIsLoading(true)
    try {
      // Simulate API call to create pet
      const newPet = {
        id: Date.now().toString(),
        ...petData,
        createdAt: new Date().toISOString(),
        mood: 'neutral',
        energy: 50,
        hunger: 50,
        happiness: 50,
        level: 1
      }
      setPets([newPet])
      setCurrentPet(newPet)
      return newPet
    } catch (error) {
      console.error('Error creating pet:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updatePetMood = (petId, newMood) => {
    setPets(prev => prev.map(pet => 
      pet.id === petId ? { ...pet, mood: newMood } : pet
    ))
    if (currentPet?.id === petId) {
      setCurrentPet(prev => ({ ...prev, mood: newMood }))
    }
  }

  const value = {
    user,
    setUser,
    pets,
    currentPet,
    setCurrentPet,
    createPet,
    updatePetMood,
    isLoading
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}