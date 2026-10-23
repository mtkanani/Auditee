import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce a value by a specified delay (ms).
 * Prevents rapid API triggers during keystrokes in search boxes.
 * @param {any} value - The input value to debounce.
 * @param {number} delay - Debounce duration in milliseconds (default: 400ms).
 * @returns {any} Debounced value.
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
