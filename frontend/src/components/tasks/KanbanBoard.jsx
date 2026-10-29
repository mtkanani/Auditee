import React from 'react';
import { cn } from '../../lib/cn';
import { TaskCard } from './TaskCard';

const COLUMNS = [
  { key: 'PENDING', title: 'Pending', dot: 'bg-warning' },
  { key: 'IN_PROGRESS', title: 'In progress', dot: 'bg-accent' },
  { key: 'COMPLETED', title: 'Completed', dot: 'bg-success' },
];

/** Three status columns for the employee views. Scrolls sideways on narrow screens. */
export const KanbanBoard = ({ tasks = [], onTaskClick, onStatusChange }) => (
  <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
    <div className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-4 min-w-full">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => String(t.status).toUpperCase() === col.key);
        return (
          <section key={col.key} aria-label={col.title} className="rounded-2xl bg-sunken/70 border border-line p-3 min-h-[50vh] flex flex-col">
            <header className="flex items-center gap-2 px-1 pb-3">
              <span className={cn('w-2 h-2 rounded-full', col.dot)} aria-hidden="true" />
              <h3 className="text-sm font-medium text-fg">{col.title}</h3>
              <span className="ml-auto text-xs font-medium text-subtle tabular-nums">{colTasks.length}</span>
            </header>
            <div className="space-y-2.5 flex-1">
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick} onStatusChange={onStatusChange} />
              ))}
              {colTasks.length === 0 && (
                <p className="text-xs text-subtle text-center py-8 border border-dashed border-line rounded-xl">Nothing here</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  </div>
);
