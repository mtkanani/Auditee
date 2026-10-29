import React from 'react';
import { cn } from '../../../lib/cn';

/** Small labelled value used in the detail tabs. mono for IDs like GSTIN / PAN. */
export const InfoItem = ({ label, value, mono, className }) => (
  <div className={cn('min-w-0', className)}>
    <dt className="text-xs text-subtle">{label}</dt>
    <dd className={cn('mt-0.5 text-sm text-fg break-words', mono && 'font-mono text-[13px]', !value && 'text-subtle')}>
      {value || 'Not added'}
    </dd>
  </div>
);

/** Tile with a heading, for groups of InfoItems. */
export const Section = ({ title, icon: Icon, children, className }) => (
  <section className={cn('rounded-2xl border border-line bg-surface p-5', className)}>
    <h4 className="flex items-center gap-2 text-sm font-semibold text-fg mb-4">
      {Icon && <Icon className="w-4 h-4 text-accent-fg" aria-hidden="true" />}
      {title}
    </h4>
    {children}
  </section>
);
