import React from 'react';

export const HistoryTab = ({ task }) => (
  <div className="space-y-4">
    <h4 className="text-sm font-bold text-slate-200">Chronological Task Audit Timeline</h4>
    <div className="space-y-3 relative border-l border-slate-800 ml-4 pl-6">
      {task?.history?.map((h) => (
        <div key={h.id} className="relative">
          <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900" />
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400">{h.action}</span>
              <span className="text-[10px] text-slate-500">{new Date(h.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-slate-300">{h.details}</p>
            <p className="text-[10px] text-slate-500">By {h.performedName}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
