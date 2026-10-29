import React from 'react';
import { Badge } from '../ui';

const tone = { URGENT: 'danger', HIGH: 'warning', MEDIUM: 'accent', LOW: 'neutral' };

/** Task priority tag. Accepts any case ("HIGH", "high"); defaults to Medium. */
export const PriorityBadge = ({ priority }) => {
  const p = String(priority || 'MEDIUM').toUpperCase();
  return <Badge tone={tone[p] || 'neutral'}>{p.charAt(0) + p.slice(1).toLowerCase()}</Badge>;
};
