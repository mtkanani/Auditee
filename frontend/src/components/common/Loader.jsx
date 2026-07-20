import React from 'react';

export const Loader = ({ size = 'md', message = 'Loading...' }) => {
  const spinnerSize = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size] || 'w-8 h-8 border-3';

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${spinnerSize} border-indigo-500 border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="text-xs font-medium text-slate-400">{message}</p>}
    </div>
  );
};
