import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../../lib/cn';

/** Numbered section of the add-client flow. done shows a check instead of the number. */
export const StepCard = ({ step, title, description, done, aside, children, className }) => (
  <section className={cn('rounded-2xl border border-line bg-surface p-5 space-y-4', className)}>
    <header className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'grid place-items-center w-7 h-7 rounded-full text-xs font-semibold shrink-0',
            done ? 'bg-success text-on-accent' : 'bg-accent-soft text-accent-fg'
          )}
        >
          {done ? <Check className="w-4 h-4" aria-hidden="true" /> : step}
        </span>
        <div>
          <h3 className="text-sm font-semibold text-fg">{title}</h3>
          {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
        </div>
      </div>
      {aside}
    </header>
    {children}
  </section>
);

/** Read-only fact inside a verification result. */
export const Fact = ({ label, value, mono }) => (
  <div className="min-w-0">
    <dt className="text-xs text-subtle">{label}</dt>
    <dd className={cn('text-sm text-fg mt-0.5 break-words', mono && 'font-mono text-[13px]')}>{value || '—'}</dd>
  </div>
);
