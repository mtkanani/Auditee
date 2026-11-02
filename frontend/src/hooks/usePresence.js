import { useEffect, useState } from 'react';

/**
 * Keeps something mounted while its closing animation plays. Returns { mounted, state }:
 * state is 'open' or 'closed' (use it as data-state for the CSS animations in index.css).
 * duration should match the CSS exit animation (ms).
 */
export const usePresence = (isOpen, duration = 180) => {
  const [mounted, setMounted] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      return undefined;
    }
    const timer = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration]);

  return { mounted: mounted || isOpen, state: isOpen ? 'open' : 'closed' };
};
