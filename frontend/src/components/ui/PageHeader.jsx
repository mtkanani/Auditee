import React from 'react';
import { cn } from '../../lib/cn';

/** Page title row. eyebrow: small label above the title; actions: buttons on the right (wrap on mobile). */
export const PageHeader = ({ eyebrow, title, description, actions, className }) => (
  <div className={cn('flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4', className)}>
    <div className="min-w-0">
      {eyebrow && <p className="text-xs font-semibold text-accent-fg mb-1">{eyebrow}</p>}
      <h1 className="text-2xl font-semibold tracking-tight text-fg">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted max-w-2xl">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
  </div>
);
