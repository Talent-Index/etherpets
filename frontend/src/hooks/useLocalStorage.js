import { useState } from 'react';

/**
 * A custom hook that syncs a state value with the browser's localStorage.
 * It behaves similarly to `useState`, but the value is persisted across browser sessions.
 *
 * @param {string} key - The key to use for storing the value in localStorage.
 * @param {T} initialValue - The initial value to use if no value is found for the given key in localStorage.
 * @template T
 * @returns {[T, (value: T | ((val: T) => T)) => void]} A tuple containing the stateful value and a function to update it.
 * The setter function can accept a new value or a function that receives the previous value.
 */
function useLocalStorage(key, initialValue) {
  // Get from local storage then
  // parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  /**
   * A wrapped version of useState's setter function that persists the new value to localStorage.
   *
   * @param {T | ((val: T) => T)} value - The new value or a function to compute it from the previous value.
   */
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;