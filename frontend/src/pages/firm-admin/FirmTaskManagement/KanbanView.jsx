import React from 'react';
import { CalendarDays, ListChecks } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { PriorityBadge } from '../../../components/tasks/PriorityBadge';
import { checklist } from './checklist';

const COLUMNS = [
  { status: 'PENDING', label: 'Pending', dot: 'bg-warning' },
  { status: 'IN_PROGRESS', label: 'In progress', dot: 'bg-accent' },
  { status: 'UNDER_REVIEW', label: 'Under review', dot: 'bg-accent-2' },
  { status: 'COMPLETED', label: 'Completed', dot: 'bg-success' },
];

const isOverdue = (t) => t.dueDate && t.status !== 'COMPLETED' && new Date(t.dueDate) < new Date(new Date().toDateString());

const TaskCard = ({ task, onOpen }) => {
  const { done, total } = checklist(task);
  const overdue = isOverdue(task);
  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className="w-full text-left p-3.5 rounded-xl bg-surface border border-line shadow-card space-y-2.5 transition-all duration-150 hover:border-line-strong hover:shadow-raised hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      <div className="flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        <span className="text-xs text-subtle tabular-nums">#{task.id}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-fg line-clamp-2">{task.title}</p>
        <p className="text-xs text-subtle truncate mt-0.5">{task.client?.companyName || task.client?.clientName || 'Internal task'}</p>
      </div>
      {(total > 0 || task.dueDate) && (
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-line text-xs">
          {total > 0 ? (
            <span className="flex items-center gap-1.5 text-muted">
              <ListChecks className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="tabular-nums">{done}/{total}</span>
              <span className="w-10 h-1 rounded-full bg-hover overflow-hidden">
                <span className="block h-full bg-success" style={{ width: `${(done / total) * 100}%` }} />
              </span>
            </span>
          ) : <span />}
          {task.dueDate && (
            <span className={cn('flex items-center gap-1', overdue ? 'text-danger font-medium' : 'text-subtle')}>
              <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
              {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      )}
    </button>
  );
};

/** Four status columns. Columns scroll sideways on narrow screens instead of squashing. */
export const KanbanView = ({ isLoading, tasksByStatus, onOpen }) => (
  <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
    <div className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-4 min-w-full">
      {COLUMNS.map((col) => {
        const tasks = tasksByStatus[col.status] || [];
        return (
          <section key={col.status} aria-label={col.label} className="rounded-2xl bg-sunken/70 border border-line p-3 min-h-[60vh] flex flex-col">
            <header className="flex items-center gap-2 px-1 pb-3">
              <span className={cn('w-2 h-2 rounded-full', col.dot)} aria-hidden="true" />
              <h3 className="text-sm font-medium text-fg">{col.label}</h3>
              <span className="ml-auto text-xs font-medium text-subtle tabular-nums">{isLoading ? '' : tasks.length}</span>
            </header>
            <div className="space-y-2.5 flex-1">
              {isLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-surface border border-line space-y-2.5">
                      <div className="h-5 w-16 rounded-full bg-hover animate-pulse" />
                      <div className="h-3.5 w-3/4 rounded-full bg-hover animate-pulse" />
                      <div className="h-3 w-1/2 rounded-full bg-hover animate-pulse" />
                    </div>
                  ))
                : tasks.map((t) => <TaskCard key={t.id} task={t} onOpen={onOpen} />)}
              {!isLoading && tasks.length === 0 && (
                <p className="text-xs text-subtle text-center py-8 border border-dashed border-line rounded-xl">Nothing here</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  </div>
);
