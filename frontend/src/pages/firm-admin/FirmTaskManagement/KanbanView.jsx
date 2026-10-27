import React from 'react';
import { CardSkeleton } from '../../../components/common/Skeleton';

export const KanbanView = ({ isLoading, tasksByStatus, setSelectedTaskId, setIsDetailModalOpen }) => (
  isLoading ? (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 min-h-[60vh]">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {['PENDING', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'].map((colStatus) => {
      const colTasks = tasksByStatus[colStatus] || [];
      return (
        <div key={colStatus} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 min-h-[60vh]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">{colStatus.replace('_', ' ')}</h4>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {colTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {colTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTaskId(t.id);
                  setIsDetailModalOpen(true);
                }}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2 shadow-lg group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                    #{t.id}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                      t.priority === 'URGENT'
                        ? 'bg-rose-500/10 text-rose-400'
                        : t.priority === 'HIGH'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>

                <h5 className="text-xs font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {t.title}
                </h5>
                <p className="text-[11px] text-slate-400 truncate">
                  {t.client?.companyName || t.client?.clientName || 'Firm Task'}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Checklist: {t.subtasks?.filter((s) => s.isCompleted)?.length || 0}/{t.subtasks?.length || 0}</span>
                  {t.dueDate && <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}

            {colTasks.length === 0 && (
              <p className="text-xs text-slate-500 py-8 text-center">No tasks in this column</p>
            )}
          </div>
        </div>
      );
    })}
  </div>
  )
);
