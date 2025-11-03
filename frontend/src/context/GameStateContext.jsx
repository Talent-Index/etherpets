/**
 * Game State Context
 * Manages global game state such as energy, tokens, and notifications.
 * This context provides a centralized way to track and update player resources
 * and to display important messages throughout the application.
 */
import React, { createContext, useContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const GameStateContext = createContext();

/**
 * Custom hook to access the game state context.
 * @returns {Object} The game state context value.
 */
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

export const GameStateProvider = ({ children }) => {
  const [energy, setEnergy] = useLocalStorage('etherpets-energy', 100);
  const [tokens, setTokens] = useLocalStorage('etherpets-tokens', 0);
  const [notifications, setNotifications] = useLocalStorage('etherpets-notifications', []);

  /**
   * Adds a specified amount of energy.
   * @param {number} amount - The amount of energy to add.
   */
  const addEnergy = (amount) => {
    setEnergy(prev => Math.min(100, prev + amount));
  };

  /**
   * Spends a specified amount of energy.
   * @param {number} amount - The amount of energy to spend.
   * @returns {boolean} - True if energy was spent, false otherwise.
   */
  const spendEnergy = (amount) => {
    if (energy >= amount) {
      setEnergy(prev => prev - amount);
      return true;
    }
    return false;
  };

  /**
   * Adds a specified amount of tokens.
   * @param {number} amount - The amount of tokens to add.
   */
  const addTokens = (amount) => {
    setTokens(prev => prev + amount);
  };

  /**
   * Adds a new notification to the list.
   * @param {Object} notification - The notification object to add.
   */
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep max 20
  };

  /**
   * Marks a notification as read.
   * @param {number} id - The ID of the notification to mark as read.
   */
  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const value = {
    energy,
    addEnergy,
    spendEnergy,
    tokens,
    addTokens,
    notifications,
    addNotification,
    markNotificationAsRead,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};