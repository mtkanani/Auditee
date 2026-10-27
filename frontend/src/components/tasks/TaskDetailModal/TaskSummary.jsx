import React from 'react';
import { User } from 'lucide-react';

export const TaskSummary = ({ task }) => (
  <div className="p-4 bg-slate-950/40 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Auditor(s)</span>
      <div className="flex flex-wrap items-center gap-2 mt-1">
        {task?.assignees?.map((a) => (
          <span key={a.id} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700/60 flex items-center gap-1.5">
            <User size="1em" className="text-indigo-400"  />
            <span>{a.user?.firstName} {a.user?.lastName}</span>
          </span>
        ))}

        {(!task?.assignees || task.assignees.length === 0) && (
          <span className="text-xs font-semibold text-slate-300">
            {task?.user ? `${task.user.firstName} ${task.user.lastName}` : 'Unassigned'}
          </span>
        )}
      </div>
    </div>

    <div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description / Scope</span>
      <p className="text-xs text-slate-300 mt-1 line-clamp-2">{task?.description || 'No detailed scope provided.'}</p>
    </div>
  </div>
);
