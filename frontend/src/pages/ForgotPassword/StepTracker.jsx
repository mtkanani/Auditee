import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';

const STEPS = ['Email', 'Code', 'New password'];

/** Three labelled steps; finished steps get a tick. */
export const StepTracker = ({ step }) => (
  <ol className="flex items-center mb-7" aria-label="Progress">
    {STEPS.map((label, i) => {
      const n = i + 1;
      const done = step > n;
      const current = step === n;
      return (
        <li key={label} className={cn('flex items-center', n < STEPS.length && 'flex-1')} aria-current={current ? 'step' : undefined}>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'grid place-items-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 transition-colors',
                done && 'bg-success-soft text-success',
                current && 'bg-accent text-on-accent shadow-glow',
                !done && !current && 'bg-hover text-subtle'
              )}
            >
              {done ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : n}
            </span>
            <span className={cn('text-xs font-medium whitespace-nowrap', current ? 'text-fg' : 'text-subtle')}>
              {label}
              {done && <span className="sr-only"> (done)</span>}
            </span>
          </div>
          {n < STEPS.length && <span className={cn('flex-1 h-px mx-3', done ? 'bg-success/40' : 'bg-line')} aria-hidden="true" />}
        </li>
      );
    })}
  </ol>
);
