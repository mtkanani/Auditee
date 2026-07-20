import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-800/80 rounded-lg ${className}`} />;
};
