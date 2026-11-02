import React from 'react';

export const ChartCard = ({ title, subtitle, action, children, className = '' }) => (
  <section className={`rounded-2xl border border-line bg-surface shadow-card p-5 sm:p-6 ${className}`}>
    <div className="flex items-start justify-between gap-3 mb-5">
      <div>
        <h4 className="text-sm font-semibold text-fg">{title}</h4>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
    <div className="w-full h-64 sm:h-72">{children}</div>
  </section>
);
