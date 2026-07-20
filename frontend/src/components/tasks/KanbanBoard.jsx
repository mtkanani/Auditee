import React from 'react';
import { TaskCard } from './TaskCard';

export const KanbanBoard = ({ tasks = [], onTaskClick, onStatusChange }) => {
  const columns = [
    { key: 'PENDING', title: 'Pending', color: 'border-amber-500/40 bg-amber-500/5' },
    { key: 'IN_PROGRESS', title: 'In Progress', color: 'border-indigo-500/40 bg-indigo-500/5' },
    { key: 'COMPLETED', title: 'Completed', color: 'border-emerald-500/40 bg-emerald-500/5' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => String(t.status).toUpperCase() === col.key);

        return (
          <div
            key={col.key}
            className={`p-4 rounded-2xl bg-slate-900/60 border ${col.color} backdrop-blur-xl flex flex-col h-[600px]`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm tracking-wide">{col.title}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                {colTasks.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {colTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={onTaskClick}
                  onStatusChange={onStatusChange}
                />
              ))}

              {colTasks.length === 0 && (
                <div className="flex items-center justify-center h-32 border border-dashed border-slate-800/80 rounded-xl text-xs text-slate-500">
                  No tasks in {col.title}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
