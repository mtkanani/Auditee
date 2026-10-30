import React, { useState } from 'react';
import { cn } from '../../lib/cn';

const pctOf = (v, total) => (total ? Math.round((v / total) * 100) : 0);

/**
 * Part-to-whole as one segmented bar (2px gaps between fills) with a legend that doubles as
 * the table view: every segment has its label, count and share in text, so colour is never alone.
 */
export const StatusBar = ({ segments, isLoading, emptyText = 'Nothing here yet.' }) => {
  const [hover, setHover] = useState(null);
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const shown = segments.filter((s) => s.value > 0);
  const active = hover && segments.find((s) => s.key === hover);

  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-3 rounded-full bg-hover animate-pulse" />
        <div className="grid grid-cols-3 gap-3">
          {segments.map((s) => <div key={s.key} className="h-10 rounded-xl bg-hover animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {total === 0 ? (
          <div className="h-3 rounded-full bg-sunken" role="img" aria-label={emptyText} />
        ) : (
          <div className="flex h-3 gap-[2px] rounded-full overflow-hidden bg-sunken" role="img" aria-label={segments.map((s) => `${s.label} ${s.value}`).join(', ')}>
            {shown.map((s) => (
              <div
                key={s.key}
                onMouseEnter={() => setHover(s.key)}
                onMouseLeave={() => setHover(null)}
                className={cn('h-full transition-opacity duration-150', hover && hover !== s.key && 'opacity-40')}
                style={{ width: `${(s.value / total) * 100}%`, minWidth: 6, background: s.color }}
              />
            ))}
          </div>
        )}
        {active && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-fg text-page text-xs font-medium whitespace-nowrap shadow-raised pointer-events-none">
            {active.label}: {active.value} ({pctOf(active.value, total)}%)
          </div>
        )}
      </div>

      <dl className="grid grid-cols-3 gap-2">
        {segments.map((s) => (
          <div
            key={s.key}
            onMouseEnter={() => setHover(s.key)}
            onMouseLeave={() => setHover(null)}
            className={cn('min-w-0 rounded-xl px-2 py-2 transition-colors', hover === s.key ? 'bg-hover' : 'bg-transparent')}
          >
            <dt className="flex items-center gap-1.5 text-xs text-muted min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} aria-hidden="true" />
              <span className="truncate whitespace-nowrap">{s.label}</span>
            </dt>
            <dd className="mt-0.5 text-lg font-semibold text-fg tabular-nums">
              {s.value}
              <span className="ml-1 text-xs font-normal text-subtle">{pctOf(s.value, total)}%</span>
            </dd>
          </div>
        ))}
      </dl>
      {total === 0 && <p className="text-sm text-muted">{emptyText}</p>}
    </div>
  );
};
