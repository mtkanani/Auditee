import React from 'react';

export const ChartCard = ({ title, subtitle, action, children, className = '' }) => {
  return (
    <div
      className={`p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 dark:border-slate-800 shadow-xl ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-semibold text-slate-100">{title}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full h-64 sm:h-72">{children}</div>
    </div>
  );
};
