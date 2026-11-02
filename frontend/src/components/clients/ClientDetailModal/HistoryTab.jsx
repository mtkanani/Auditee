import React from 'react';
import { History } from 'lucide-react';

export const HistoryTab = ({ client }) => {
  const logs = client.activityLogs || [];

  if (logs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line px-5 py-10 text-center">
        <History className="w-6 h-6 text-subtle mx-auto mb-2" aria-hidden="true" />
        <p className="text-sm font-medium text-fg">No activity yet</p>
        <p className="text-sm text-muted">Changes to this client will be listed here.</p>
      </div>
    );
  }

  return (
    <ol className="relative ml-2 border-l border-line space-y-5">
      {logs.map((log) => (
        <li key={log.id} className="relative pl-6">
          <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-surface" aria-hidden="true" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="text-sm font-medium text-fg">{log.action}</p>
            <time className="text-xs text-subtle">
              {new Date(log.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </time>
          </div>
          {log.description && <p className="text-sm text-muted mt-0.5">{log.description}</p>}
          <p className="text-xs text-subtle mt-0.5">by {log.performedName || 'System'}</p>
        </li>
      ))}
    </ol>
  );
};
