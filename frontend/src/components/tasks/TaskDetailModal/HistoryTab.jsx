import React from 'react';
import { Clock } from 'lucide-react';

const when = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
const actionLabel = (a = '') => a.toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export const HistoryTab = ({ task }) => {
  const history = task?.history || [];
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-center rounded-2xl border border-dashed border-line">
        <Clock className="w-5 h-5 text-subtle mb-2" aria-hidden="true" />
        <p className="text-sm text-muted">No history recorded yet.</p>
      </div>
    );
  }
  return (
    <ol className="relative border-l border-line ml-2 space-y-5">
      {history.map((h) => (
        <li key={h.id} className="relative pl-6">
          <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-page" aria-hidden="true" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="text-sm font-medium text-fg">{actionLabel(h.action)}</p>
            <span className="text-xs text-subtle tabular-nums">{when(h.createdAt)}</span>
          </div>
          {h.details && <p className="text-sm text-muted mt-0.5">{h.details}</p>}
          <p className="text-xs text-subtle mt-0.5">By {h.performedName}</p>
        </li>
      ))}
    </ol>
  );
};
