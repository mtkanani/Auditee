import React, { useRef } from 'react';
import { cn } from '../../lib/cn';

/**
 * Segmented tabs. items: [{ value, label, icon?, count? }].
 * Arrow keys move between tabs (WAI-ARIA tabs pattern); variant 'pill' (default) or 'underline'.
 */
export const Tabs = ({ items, value, onChange, variant = 'pill', className, 'aria-label': ariaLabel }) => {
  const refs = useRef([]);

  const onKeyDown = (e, index) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + items.length) % items.length;
    refs.current[next]?.focus();
    onChange(items[next].value);
  };

  const pill = variant === 'pill';

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'flex items-center gap-1 overflow-x-auto',
        pill ? 'p-1 rounded-xl bg-sunken border border-line w-fit max-w-full' : 'border-b border-line',
        className
      )}
    >
      {items.map((item, i) => {
        const active = item.value === value;
        const Icon = item.icon;
        return (
          <button
            key={item.value}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'inline-flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
              pill
                ? cn('h-8 px-3 rounded-lg', active ? 'bg-surface text-fg shadow-card' : 'text-muted hover:text-fg')
                : cn('h-10 px-1 mr-4 -mb-px border-b-2', active ? 'border-accent text-fg' : 'border-transparent text-muted hover:text-fg')
            )}
          >
            {Icon && <Icon className={cn('w-4 h-4', active && 'text-accent-fg')} aria-hidden="true" />}
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  'min-w-5 h-5 px-1.5 rounded-full text-[11px] leading-5 font-semibold tabular-nums text-center',
                  active ? 'bg-accent-soft text-accent-fg' : 'bg-hover text-subtle'
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
