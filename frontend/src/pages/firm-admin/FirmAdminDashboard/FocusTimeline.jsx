import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CircleCheckBig, FileCheck2, ListTodo } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { dueLabel } from './format';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'filing', label: 'Filings' },
  { value: 'task', label: 'Tasks' },
];

const dotTone = { danger: 'bg-danger', warning: 'bg-warning', neutral: 'bg-line-strong' };

/** Filings and tasks that are overdue or due within 7 days, on one timeline (nearest first). */
export const FocusTimeline = ({ compliance, dueTasks, overdueInvoices }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const items = [
    ...compliance.map((c) => ({
      key: `c-${c.id}`,
      kind: 'filing',
      title: c.title,
      who: c.client?.companyName || c.client?.clientName || 'All clients',
      dueDate: c.dueDate,
      to: '/firm-admin/compliance',
    })),
    ...dueTasks.map((t) => ({
      key: `t-${t.id}`,
      kind: 'task',
      title: t.title,
      who: [t.client?.companyName || t.client?.clientName, t.user && `${t.user.firstName} ${t.user.lastName}`].filter(Boolean).join(' · ') || 'Firm task',
      dueDate: t.dueDate,
      to: '/firm-admin/tasks',
    })),
  ]
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .filter((i) => filter === 'all' || i.kind === filter);

  return (
    <Card
      title="Today's focus"
      description="Overdue and due in the next 7 days"
      padded={false}
      className="rise h-full"
      actions={
        <div className="flex items-center gap-1 p-1 rounded-xl bg-sunken border border-line" role="tablist" aria-label="Show">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'h-7 px-2.5 rounded-lg text-xs font-medium transition-colors',
                filter === f.value ? 'bg-surface text-fg shadow-card' : 'text-muted hover:text-fg'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      }
    >
      {overdueInvoices > 0 && (
        <button
          type="button"
          onClick={() => navigate('/firm-admin/billing')}
          className="w-full flex items-center justify-between gap-3 px-5 py-2.5 border-t border-line bg-danger-soft/50 text-left text-sm hover:bg-danger-soft transition-colors"
        >
          <span className="text-danger font-medium">
            {overdueInvoices} invoice{overdueInvoices === 1 ? ' is' : 's are'} overdue
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-danger">
            Follow up <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
        </button>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center text-center px-5 py-12 border-t border-line">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-success-soft text-success mb-3">
            <CircleCheckBig className="w-6 h-6" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium text-fg">You're all caught up</p>
          <p className="text-sm text-muted mt-0.5">Nothing is overdue and nothing is due this week.</p>
        </div>
      ) : (
        <ol className="relative border-t border-line px-5 py-3">
          {/* the timeline's spine */}
          <span aria-hidden="true" className="absolute left-[34px] top-5 bottom-5 w-px bg-line" />
          {items.map((item, idx) => {
            const due = dueLabel(item.dueDate);
            const Icon = item.kind === 'filing' ? FileCheck2 : ListTodo;
            return (
              <li key={item.key} className="rise relative" style={{ '--i': Math.min(idx, 8) + 2 }}>
                <button
                  type="button"
                  onClick={() => navigate(item.to)}
                  className="w-full flex items-center gap-3 py-2.5 pl-1 pr-2 rounded-xl text-left hover:bg-hover transition-colors focus-visible:outline-none focus-visible:bg-hover"
                >
                  <span className="relative grid place-items-center w-7 h-7 rounded-full bg-surface border border-line shrink-0 z-10">
                    <span className={cn('w-2 h-2 rounded-full', dotTone[due.tone] || dotTone.neutral)} aria-hidden="true" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-fg">
                      <Icon className="w-3.5 h-3.5 text-subtle shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.title}</span>
                    </span>
                    <span className="block text-xs text-subtle truncate">{item.who}</span>
                  </span>
                  <Badge tone={due.tone} dot className="shrink-0">
                    {due.text}
                  </Badge>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <div className="flex justify-end gap-1 px-3 py-2 border-t border-line">
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/compliance')}>
          Compliance
        </Button>
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/tasks')}>
          Tasks
        </Button>
      </div>
    </Card>
  );
};
