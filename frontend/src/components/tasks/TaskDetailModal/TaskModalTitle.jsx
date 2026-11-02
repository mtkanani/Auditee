import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Badge } from '../../ui';
import { PriorityBadge } from '../PriorityBadge';

const isOverdue = (task) => task?.dueDate && task.status !== 'COMPLETED' && new Date(task.dueDate) < new Date(new Date().toDateString());

/** Modal title: task number, priority, title, client and due date. */
export const TaskModalTitle = ({ task }) => (
  <div className="min-w-0 space-y-1.5">
    <div className="flex flex-wrap items-center gap-2">
      {task?.id && <Badge>Task #{task.id}</Badge>}
      {task && <PriorityBadge priority={task.priority || 'MEDIUM'} />}
    </div>
    <span className="block text-lg font-semibold text-fg tracking-tight">{task?.title || 'Task'}</span>
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-normal text-muted">
      <span>{task?.client?.companyName || task?.client?.clientName || 'Internal task'}</span>
      {task?.dueDate && (
        <span className={`flex items-center gap-1 ${isOverdue(task) ? 'text-danger font-medium' : ''}`}>
          <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
          Due {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      )}
    </span>
  </div>
);
