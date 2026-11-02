import React from 'react';

/** Clients owing the most, as labelled horizontal bars (one series: magnitude only). */
export const TopOutstanding = ({ rows, money }) => {
  const max = Math.max(1, ...rows.map((r) => r.balance));
  return (
    <ol className="space-y-3">
      {rows.map((r, i) => (
        <li key={r.clientId} className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-fg truncate">{r.name}</span>
            <span className="tabular-nums text-fg shrink-0">{money(r.balance)}</span>
          </div>
          <div className="h-2 rounded-full bg-sunken overflow-hidden">
            <div
              className="grow-x h-full rounded-full bg-[var(--chart-pending)]"
              style={{ width: `${Math.max(3, (r.balance / max) * 100)}%`, '--i': i }}
            />
          </div>
          <p className="text-xs text-subtle">
            {r.invoices} unpaid invoice{r.invoices === 1 ? '' : 's'}
          </p>
        </li>
      ))}
    </ol>
  );
};
