import React from 'react';
import { Avatar } from '../../common/Avatar';

export const TaskSummary = ({ task }) => {
  const assignees = task?.assignees || [];
  return (
    <div className="px-6 py-4 border-b border-line bg-sunken/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="min-w-0">
        <p className="text-xs text-subtle">Assigned to</p>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          {assignees.map((a) => (
            <span key={a.id} className="inline-flex items-center gap-1.5 h-7 pl-1 pr-2.5 rounded-full bg-surface border border-line text-sm text-fg">
              <Avatar firstName={a.user?.firstName} lastName={a.user?.lastName} size="sm" className="!w-5 !h-5 !text-[9px]" />
              {a.user?.firstName} {a.user?.lastName}
            </span>
          ))}
          {assignees.length === 0 && (
            <span className="text-sm text-muted">{task?.user ? `${task.user.firstName} ${task.user.lastName}` : 'Unassigned'}</span>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-xs text-subtle">Scope</p>
        <p className="text-sm text-muted mt-1.5 line-clamp-3">{task?.description || 'No detailed scope provided.'}</p>
      </div>
    </div>
  );
};
