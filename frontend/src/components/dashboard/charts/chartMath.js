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

/**
 * Smooth line through points [[x, y], ...] that never overshoots the data (monotone cubic,
 * Fritsch-Carlson), so a wave never dips below zero or above the real values.
 */
export const monotonePath = (pts) => {
  const n = pts.length;
  if (n === 0) return '';
  if (n === 1) return `M${pts[0][0]},${pts[0][1]}`;
  const dx = [], dy = [], m = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0]);
    dy.push(pts[i + 1][1] - pts[i][1]);
    m.push(dy[i] / dx[i]);
  }
  const t = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${pts[i][0] + h},${pts[i][1] + h * t[i]} ${pts[i + 1][0] - h},${pts[i + 1][1] - h * t[i + 1]} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
};

const MODE_KEY = 'auditee-chart-mode';

/** Bar or wave, remembered per chart in this browser. */
export const useChartMode = (chartId, fallback = 'bar') => {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(`${MODE_KEY}:${chartId}`) || fallback;
    } catch {
      return fallback;
    }
  });
  const change = (next) => {
    setMode(next);
    try {
      localStorage.setItem(`${MODE_KEY}:${chartId}`, next);
    } catch {
      // storage blocked: the choice still applies for this visit
    }
  };
  return [mode, change];
};
