import React from 'react';

export const HistoryTab = ({ client }) => (
  <div className="space-y-4">
    <h4 className="text-sm font-bold text-slate-200">Chronological Client Audit & Activity Timeline</h4>

    <div className="space-y-3 relative border-l border-slate-800 ml-4 pl-6">
      {client.activityLogs?.map((log) => (
        <div key={log.id} className="relative group">
          <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900" />
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400">{log.action}</span>
              <span className="text-[10px] text-slate-500">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-slate-300">{log.description}</p>
            <p className="text-[10px] text-slate-500">By {log.performedName || 'System'}</p>
          </div>
        </div>
      ))}

      {(!client.activityLogs || client.activityLogs.length === 0) && (
        <p className="text-xs text-slate-500">No historical activity recorded yet.</p>
      )}
    </div>
  </div>
);
