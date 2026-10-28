import React from 'react';
import { Badge } from '../../../components/ui';

const tone = { URGENT: 'danger', HIGH: 'warning', MEDIUM: 'accent', LOW: 'neutral' };
const label = (p = 'MEDIUM') => p.charAt(0) + p.slice(1).toLowerCase();

export const PriorityBadge = ({ priority }) => (
  <Badge tone={tone[priority] || 'neutral'}>{label(priority)}</Badge>
);
