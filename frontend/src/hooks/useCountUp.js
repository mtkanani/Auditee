import { useEffect, useRef, useState } from 'react';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Animates a number from its previous value to `target` (ease-out, requestAnimationFrame).
 * Returns the current value. Jumps straight to the target when the user prefers reduced motion.
 */
export const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const to = Number(target) || 0;
    if (reducedMotion()) {
      setValue(to);
      from.current = to;
      return undefined;
    }
    const start = performance.now();
    const begin = from.current;
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(begin + (to - begin) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = to;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
};
