import React from 'react';
import { CircleCheckBig } from 'lucide-react';

export const ChecklistProgress = ({ completedSubtasks, totalSubtasks, progressPercent }) => (
  <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-4">
    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
      <CircleCheckBig size="1em" className="text-indigo-400"  />
      <span>Checklist Progress ({completedSubtasks}/{totalSubtasks})</span>
    </span>
    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
    <span className="text-xs font-extrabold text-indigo-400">{progressPercent}%</span>
  </div>
);
