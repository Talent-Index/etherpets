/**
 * User Context for managing user state and pet data
 * Handles pet creation, updates, and local storage persistence
 */
import React, { createContext, useContext, useState } from 'react'
import { useGameState } from './GameStateContext'
import useLocalStorage from '../hooks/useLocalStorage'
import apiClient from '../utils/api';

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
   * Fetches all pets for a given owner address from the backend.
   * @param {string} ownerAddress - The wallet address of the owner.
   */
  const fetchPetsByOwner = async (ownerAddress) => {
    if (!ownerAddress) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/pets/owner/${ownerAddress}`);
      const fetchedPets = response.data.data || [];
      // Add 'id' field to match local usage if backend uses '_id'
      const petsWithId = fetchedPets.map(p => ({ ...p, id: p._id }));
      setPets(petsWithId);

      // If there's no current pet, set the first one as active
      if (!currentPet && petsWithId.length > 0) {
        setCurrentPet(petsWithId[0]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setPets([]); // User has no pets, which is not an error
      } else {
        console.error('Error fetching pets:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * Create a new pet for the user
   * @param {Object} petData - The pet data to create
   * @returns {Promise<Object>} The created pet
   */
  const createPet = async (petData) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post('/pets', petData);
      const newPet = response.data.data;

      // Assuming the backend returns the full pet object
      setPets(prev => [...prev, { ...newPet, id: newPet._id }]);
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
    try {
      // Note: Your backend doesn't seem to have a generic update endpoint.
      // This function will update local state, while specific actions call their own endpoints.
      setPets(prev => prev.map(pet => 
        pet.id === petId ? { ...pet, ...updates } : pet
      ));
      
      if (currentPet?.id === petId) {
        setCurrentPet(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      console.error('Error updating pet locally:', error);
      return false;
    }
    return true
  }

  /**
   * Update pet mood
   * @param {string} petId - The ID of the pet
   * @param {string} newMood - The new mood value
   * @returns {Promise<boolean>} Success status
   */
  const updatePetMood = async (petId, newMood) => {
    try {
      const response = await apiClient.post(`/pets/${petId}/mood`, { mood: newMood });
      const updatedPet = response.data.data;
      updatePet(petId, updatedPet);
      addNotification({ type: 'pet', message: `${updatedPet.name}'s mood is now ${newMood}!` });
      return true;
    } catch (error) {
      console.error('Error updating pet mood:', error);
      addNotification({ type: 'error', message: 'Failed to update mood.' });
      return false;
    }
  }

  /**
   * Perform an action on a pet (feed, play, rest, meditate)
   * @param {string} petId - The ID of the pet
   * @param {string} actionType - The type of action to perform
   * @returns {Promise<boolean>} Success status
   */
  const performPetAction = async (petId, actionType) => {
    if (!currentPet) return false;

    // The backend has separate endpoints for feed, play, etc.
    // We'll use a generic actionType to route to the correct controller method.
    // This assumes your backend router has routes like /pets/:petId/feed, /pets/:petId/play
    try {
      const response = await apiClient.post(`/pets/${petId}/${actionType}`, {
        // Add any required body payload here, e.g., { foodType: 'basic' }
      });
      const { pet: updatedPet, leveledUp, newLevel } = response.data.data;

      updatePet(petId, updatedPet);

      if (leveledUp) {
        levelUpPet(petId, newLevel);
      }
      
      // Add small energy reward for interacting with pet
      addEnergy(5)
      addNotification({
        type: 'pet',
        message: `${currentPet.name} enjoyed the ${actionType}!`,
        read: false
      });
      return true;
    } catch (error) {
      console.error(`Error performing action ${actionType}:`, error);
      addNotification({ type: 'error', message: `Action '${actionType}' failed.` });
      return false;
    }
  }

  /**
   * Level up a pet when it gains enough experience
   * @param {string} petId - The ID of the pet to level up
   */
  const levelUpPet = (petId, newLevel) => {
    setPets(prev => prev.map(pet => {
      if (pet.id === petId) {
        return { ...pet, level: newLevel, experience: 0, energy: 100, happiness: 100 };
      }
      return pet
    }))

    if (currentPet?.id === petId) {
      setCurrentPet(prev => ({
        ...prev,
        level: newLevel,
        energy: 100,
        happiness: 100,
        experience: 0
      }))
    }

    addNotification({
      type: 'level',
      message: `${currentPet?.name} reached level ${newLevel}!`,
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
    fetchPetsByOwner,
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