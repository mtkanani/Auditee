import React from 'react';
import { getStatusBadgeColor } from '../../utils/helpers';

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const colorClasses = getStatusBadgeColor(status);
  const formattedText = String(status).replace('_', ' ').toUpperCase();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses} transition-all duration-200`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {formattedText}
    </span>
  );
};
