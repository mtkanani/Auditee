import { useLayoutEffect, useRef, useState } from 'react';

// Plain helpers for the dashboard charts.

/** Width of an element, kept up to date as it resizes (charts draw to their card's width). */
export const useWidth = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return undefined;
    // Measure straight away so the chart draws on first paint, then follow resizes.
    setWidth(Math.floor(ref.current.getBoundingClientRect().width));
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
};

/** A "nice" axis maximum and 3-4 tick values for a data maximum (0 -> a 0..4 axis). */
export const niceTicks = (max, count = 4) => {
  if (!max || max <= 0) return { top: count, ticks: Array.from({ length: count + 1 }, (_, i) => i) };
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
  const top = step * Math.ceil(max / step);
  return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step) };
};

/** Path for a bar with 4px rounded top corners, anchored flat on the baseline. */
export const barPath = (x, y, w, h, r = 4) => {
  if (h <= 0) return '';
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
};
