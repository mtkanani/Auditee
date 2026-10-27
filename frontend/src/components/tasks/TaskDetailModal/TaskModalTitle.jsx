import React from 'react';
import { Calendar } from 'lucide-react';

export const TaskModalTitle = ({ task }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
        Task #{task?.id}
      </span>
      <span
        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded ${
          task?.priority === 'URGENT'
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            : task?.priority === 'HIGH'
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}
      >
        {task?.priority || 'MEDIUM'} PRIORITY
      </span>
    </div>
    <span className="block text-xl font-extrabold text-slate-100 tracking-tight">{task?.title}</span>
    <span className="text-xs font-normal text-slate-400 flex items-center gap-3">
      <span>Client: {task?.client?.companyName || task?.client?.clientName || 'Firm Internal'}</span>
      {task?.dueDate && (
        <>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-400">
            <Calendar size="1em" /> Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </>
      )}
    </span>
  </div>
);
