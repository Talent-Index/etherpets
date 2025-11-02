import { useState, useEffect } from 'react'

export const usePetData = (petId) => {
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPetData = async () => {
      if (!petId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
          const mockPet = {
            id: petId,
            name: 'Luna',
            type: 'Spirit Fox',
            level: 5,
            mood: 'happy',
            energy: 85,
            happiness: 90,
            lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            createdAt: new Date('2024-01-15')
          }
          setPet(mockPet)
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchPetData()
  }, [petId])

  const updatePet = async (updates) => {
    try {
      // Simulate API update
      setPet(prev => ({ ...prev, ...updates }))
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const performAction = async (actionType) => {
    if (!pet) return false

    const actionEffects = {
      feed: { energy: Math.min(pet.energy + 20, 100), happiness: Math.min(pet.happiness + 10, 100) },
      play: { energy: Math.max(pet.energy - 10, 0), happiness: Math.min(pet.happiness + 20, 100) },
      rest: { energy: Math.min(pet.energy + 30, 100), mood: 'calm' },
      meditate: { happiness: Math.min(pet.happiness + 15, 100), mood: 'calm' }
    }

    const effects = actionEffects[actionType] || {}
    return await updatePet({ ...effects, lastFed: new Date() })
  }

  return {
    pet,
    loading,
    error,
    updatePet,
    performAction
  }
}