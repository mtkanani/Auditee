import React from 'react';
import { Building2, CalendarDays } from 'lucide-react';
import { Select, StatusTag } from '../ui';
import { PriorityBadge } from './PriorityBadge';
import { formatDate } from '../../utils/helpers';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

/** Board card. The title is the button (stretched over the card); the status picker stays clickable on top. */
export const TaskCard = ({ task, onClick, onStatusChange }) => (
  <article className="relative p-4 rounded-xl bg-surface border border-line shadow-card space-y-3 transition-all duration-150 hover:border-line-strong hover:shadow-raised hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-accent/50">
    <div className="flex items-start justify-between gap-2">
      <h4 className="text-sm font-medium text-fg line-clamp-2">
        <button type="button" onClick={() => onClick && onClick(task)} className="text-left after:absolute after:inset-0 after:content-[''] focus:outline-none">
          {task.title || task.name}
        </button>
      </h4>
      <PriorityBadge priority={task.priority} />
    </div>

    {task.description && <p className="text-xs text-muted line-clamp-2">{task.description}</p>}

    {(task.dueDate || task.client) && (
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-line text-xs text-subtle">
        {task.dueDate ? (
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
            {formatDate(task.dueDate)}
          </span>
        ) : <span />}
        {task.client && (
          <span className="flex items-center gap-1 min-w-0">
            <Building2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[120px]">{task.client.clientName}</span>
          </span>
        )}
      </div>
    )}

    <div className="flex items-center justify-between gap-2">
      <StatusTag status={task.status} />
      {onStatusChange && (
        <div className="relative z-10 w-32">
          <Select
            aria-label={`Status of ${task.title || task.name}`}
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            options={STATUS_OPTIONS}
            className="h-8 text-xs"
          />
        </div>
      )}
    </div>
  </article>
);
