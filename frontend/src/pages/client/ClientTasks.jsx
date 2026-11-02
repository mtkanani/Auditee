import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader, StatusTag, Table } from '../../components/ui';
import { EmptyState } from '../../components/common/EmptyState';
import { PriorityBadge } from '../../components/tasks/PriorityBadge';
import { useClientTasks } from '../../queries/useTasks';
import { formatDate } from '../../utils/helpers';

const NewRequestLink = () => (
  <Link
    to="/client/work-requests"
    className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-accent text-on-accent text-sm font-medium hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
  >
    <Plus className="w-4 h-4" aria-hidden="true" />
    New request
  </Link>
);

export const ClientTasks = () => {
  const { tasks, isLoading, error } = useClientTasks();

  useEffect(() => {
    if (error) {
      toast.error('Failed to load tasks');
    }
  }, [error]);

  const columns = [
    {
      header: 'Request',
      key: 'title',
      render: (r) => (
        <div className="min-w-0">
          <p className="font-medium text-fg">{r.title}</p>
          {r.description && <p className="text-xs text-muted line-clamp-1 mt-0.5">{r.description}</p>}
        </div>
      ),
    },
    { header: 'Priority', key: 'priority', render: (r) => <PriorityBadge priority={r.priority} /> },
    { header: 'Status', key: 'status', render: (r) => (r.status ? <StatusTag status={String(r.status).toUpperCase()} /> : '—') },
    {
      header: 'Requested',
      key: 'createdAt',
      render: (r) => <span className="text-muted tabular-nums">{r.createdAt ? formatDate(r.createdAt) : '—'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My requests"
        description="Follow the progress of your filings, returns and audit work."
        actions={<NewRequestLink />}
      />

      <Table
        columns={columns}
        data={tasks}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={ClipboardList}
            title="No requests yet"
            description="Send your firm a request and you can follow its progress here."
            action={<NewRequestLink />}
          />
        }
      />
    </div>
  );
};
