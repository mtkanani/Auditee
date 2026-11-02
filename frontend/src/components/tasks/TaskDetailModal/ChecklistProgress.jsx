import React from 'react';

export const ChecklistProgress = ({ completedSubtasks, totalSubtasks, progressPercent }) => (
  <div className="px-6 py-3 border-b border-line flex items-center gap-4">
    <span className="text-sm text-muted whitespace-nowrap">
      Checklist <span className="font-medium text-fg tabular-nums">{completedSubtasks}/{totalSubtasks}</span>
    </span>
    <div
      className="flex-1 h-1.5 rounded-full bg-hover overflow-hidden"
      role="progressbar"
      aria-label="Checklist progress"
      aria-valuenow={progressPercent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full bg-success transition-all duration-300" style={{ width: `${progressPercent}%` }} />
    </div>
    <span className="text-sm font-medium text-fg tabular-nums">{progressPercent}%</span>
  </div>
);
