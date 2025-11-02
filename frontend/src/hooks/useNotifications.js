import { useState, useCallback } from 'react';

/**
 * @typedef {'success' | 'error' | 'info' | 'warning'} NotificationType
 */

/**
 * @typedef {object} Notification
 * @property {number} id - A unique identifier for the notification.
 * @property {string} message - The content of the notification.
 * @property {NotificationType} type - The type of the notification.
 * @property {number} duration - The duration in milliseconds for which the notification is displayed.
 */

/**
 * A custom hook to manage and display toast-style notifications.
 * It provides functions to add notifications to a queue, which are then displayed and automatically dismissed.
 *
 * @returns {{
 *   notifications: Notification[],
 *   addNotification: (message: string, type?: NotificationType, duration?: number) => void,
 *   removeNotification: (id: number) => void,
 *   notifySuccess: (msg: string, dur?: number) => void,
 *   notifyError: (msg: string, dur?: number) => void,
 *   notifyInfo: (msg: string, dur?: number) => void,
 *   notifyWarning: (msg: string, dur?: number) => void
 * }} An object containing the notifications array and functions to manage them.
 */
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Adds a new notification to the display queue.
   * @param {string} message - The message to display.
   * @param {NotificationType} [type='info'] - The type of notification.
   * @param {number} duration - The duration in milliseconds to display the notification.
   */
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newNotification = { id, message, type, duration };

    setNotifications(prev => [...prev, newNotification]);

    // Automatically remove the notification after its duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  /**
   * Removes a notification from the display queue by its ID.
   * @param {number} id - The ID of the notification to remove.
   */
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    // Convenience methods
    notifySuccess: (msg, dur) => addNotification(msg, 'success', dur),
    notifyError: (msg, dur) => addNotification(msg, 'error', dur),
    notifyInfo: (msg, dur) => addNotification(msg, 'info', dur),
    notifyWarning: (msg, dur) => addNotification(msg, 'warning', dur),
  };
};

export default useNotifications;