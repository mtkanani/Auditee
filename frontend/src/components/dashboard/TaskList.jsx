import React from 'react';
import { CircleCheckBig } from 'lucide-react';
import { Badge, StatusTag } from '../ui';
import { PriorityBadge } from '../tasks/PriorityBadge';
import { dueLabel } from '../../utils/dueDate';

/**
 * Compact task rows for dashboards. subtitle(task) picks the second line; onOpen(task) makes rows clickable.
 * Shows priority, status and how soon it's due.
 */
export const TaskList = ({ tasks, isLoading, subtitle, onOpen, emptyTitle, emptyText }) => {
  if (isLoading) {
    return (
      <ul className="divide-y divide-line border-t border-line" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="px-5 py-3.5 space-y-2">
            <span className="block h-3.5 w-1/2 rounded-full bg-hover animate-pulse" />
            <span className="block h-3 w-1/3 rounded-full bg-hover animate-pulse" />
          </li>
        ))}
      </ul>
    );
  }

  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center text-center px-5 py-10 border-t border-line">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-success-soft text-success mb-3">
          <CircleCheckBig className="w-6 h-6" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-fg">{emptyTitle}</p>
        {emptyText && <p className="text-sm text-muted mt-0.5 max-w-sm">{emptyText}</p>}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line border-t border-line">
      {tasks.map((t) => {
        const due = t.dueDate && t.status !== 'COMPLETED' ? dueLabel(t.dueDate) : null;
        const body = (
          <>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-fg truncate">{t.title}</span>
              <span className="block text-xs text-subtle truncate">{subtitle?.(t)}</span>
            </span>
            <span className="hidden sm:flex items-center gap-2 shrink-0">
              {t.priority && <PriorityBadge priority={t.priority} />}
              {t.status && <StatusTag status={String(t.status).toUpperCase()} />}
            </span>
            {due && (
              <Badge tone={due.tone} dot className="shrink-0">
                {due.text}
              </Badge>
            )}
          </>
        );
        return (
          <li key={t.id}>
            {onOpen ? (
              <button
                type="button"
                onClick={() => onOpen(t)}
                className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-hover transition-colors focus-visible:outline-none focus-visible:bg-hover"
              >
                {body}
              </button>
            ) : (
              <div className="flex items-center gap-3 px-5 py-3">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
};
