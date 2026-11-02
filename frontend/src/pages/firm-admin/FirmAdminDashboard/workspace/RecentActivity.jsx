import React from 'react';
import { Activity, Briefcase, FileUp, IndianRupee, ListTodo } from 'lucide-react';
import { Card } from '../../../../components/ui';
import { timeAgo } from '../../../../utils/timeAgo';

const KIND = {
  task: { icon: ListTodo, tone: 'bg-accent-soft text-accent-fg' },
  payment: { icon: IndianRupee, tone: 'bg-success-soft text-success' },
  document: { icon: FileUp, tone: 'bg-warning-soft text-warning' },
  client: { icon: Briefcase, tone: 'bg-hover text-muted' },
};

/** What just happened across the firm, newest first. Updates live as people work. */
export const RecentActivity = ({ activity }) => (
  <Card title="Recent activity" description="Across the firm, as it happens" className="rise h-full">
    {activity.length === 0 ? (
      <p className="flex items-center gap-2 py-6 text-sm text-muted">
        <Activity className="w-4 h-4 text-subtle" aria-hidden="true" />
        Work done by your team and clients will show up here.
      </p>
    ) : (
      <ol className="relative space-y-3.5">
        <span aria-hidden="true" className="absolute left-[15px] top-2 bottom-2 w-px bg-line" />
        {activity.map((a, i) => {
          const { icon: Icon, tone } = KIND[a.kind] || KIND.client;
          return (
            <li key={a.id} className="rise relative flex items-start gap-3" style={{ '--i': Math.min(i, 8) }}>
              <span className={`relative z-10 grid place-items-center w-8 h-8 rounded-full ring-4 ring-surface shrink-0 ${tone}`}>
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <p className="flex-1 min-w-0 pt-1 text-sm text-muted leading-snug">
                <span className="font-medium text-fg">{a.actor}</span> {a.text}
                <span className="block text-xs text-subtle mt-0.5">{timeAgo(a.at)}</span>
              </p>
            </li>
          );
        })}
      </ol>
    )}
  </Card>
);
