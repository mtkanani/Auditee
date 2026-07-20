import React from 'react';

export const PriorityBadge = ({ priority = 'MEDIUM' }) => {
  const p = String(priority).toUpperCase();
  let colors = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

  if (p === 'HIGH') {
    colors = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (p === 'URGENT') {
    colors = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (p === 'LOW') {
    colors = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors}`}
    >
      {p}
    </span>
  );
};
