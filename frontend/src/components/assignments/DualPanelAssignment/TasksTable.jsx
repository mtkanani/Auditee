import React from 'react';
import { ClipboardList } from 'lucide-react';
import { EmptyState } from '../../common/EmptyState';
import { Badge, StatusTag, Table } from '../../ui';
import { PriorityBadge } from '../../tasks/PriorityBadge';

export const TasksTable = ({ tasks }) => (
  <Table
    data={tasks}
    emptyState={<EmptyState icon={ClipboardList} title="No tasks yet" description="Pick an employee above and press Direct task to give them one." />}
    columns={[
      {
        key: 'title',
        header: 'Task',
        render: (t) => (
          <div className="min-w-0">
            <p className="font-medium text-fg truncate max-w-[280px]">{t.title}</p>
            {t.description && <p className="text-xs text-subtle truncate max-w-[280px]">{t.description}</p>}
          </div>
        ),
      },
      { key: 'user', header: 'Assigned to', render: (t) => <span className="text-muted">{t.user ? `${t.user.firstName} ${t.user.lastName}` : 'Unassigned'}</span> },
      { key: 'client', header: 'Client', render: (t) => (t.client ? <Badge>{t.client.clientName}</Badge> : <Badge tone="accent">Internal</Badge>) },
      { key: 'priority', header: 'Priority', render: (t) => <PriorityBadge priority={t.priority} /> },
      { key: 'status', header: 'Status', render: (t) => <StatusTag status={t.status} /> },
      {
        key: 'dueDate',
        header: 'Due',
        align: 'right',
        render: (t) => (
          <span className="text-muted tabular-nums whitespace-nowrap">
            {t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
          </span>
        ),
      },
    ]}
  />
);
