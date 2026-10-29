import React from 'react';
import { StatCard } from '../ui/Card';

// Old colour names map to the theme's tones.
const TONE = { indigo: 'accent', purple: 'accent', emerald: 'success', amber: 'warning', rose: 'danger', blue: 'neutral' };

/** Older stats card API (title, value, icon, change, trend, color) drawn with the kit StatCard. */
export const StatsCard = ({ title, value, icon, change, trend = 'up', color = 'indigo' }) => (
  <StatCard label={title} value={value} icon={icon} tone={TONE[color] || 'accent'} delta={change} trend={trend} hint={change ? 'vs last month' : undefined} />
);
