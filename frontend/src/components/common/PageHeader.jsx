import React from 'react';
import { Breadcrumb } from './Breadcrumb';

export const PageHeader = ({ title, subtitle, actions, showBreadcrumb = true }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        {showBreadcrumb && <Breadcrumb />}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};
