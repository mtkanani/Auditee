import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button, Select } from '../../../components/ui';
import { PriorityBadge } from '../../../components/tasks/PriorityBadge';
import { checklist } from './checklist';

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'UNDER_REVIEW', label: 'Under review' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const assigneeNames = (r) => {
  if (r.assignees?.length) return r.assignees.map((a) => `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.trim()).join(', ');
  if (r.user) return `${r.user.firstName} ${r.user.lastName}`;
  return null;
};

// Inline controls shouldn't trigger the row's "open task" click.
const stop = (e) => e.stopPropagation();

export const getTaskColumns = ({ setSelectedTaskId, setIsDetailModalOpen, handleStatusChange }) => [
  {
    key: 'title',
    header: 'Task',
    render: (r) => (
      <div className="min-w-0">
        <p className="font-medium text-fg truncate max-w-[320px]">{r.title}</p>
        <p className="text-xs text-subtle truncate">{r.client?.companyName || r.client?.clientName || 'Internal task'}</p>
      </div>
    ),
  },
  {
    key: 'assignees',
    header: 'Assigned to',
    render: (r) => {
      const names = assigneeNames(r);
      return names ? <span className="text-sm text-muted line-clamp-1 max-w-[220px]">{names}</span> : <span className="text-sm text-subtle">Unassigned</span>;
    },
  },
  { key: 'priority', header: 'Priority', render: (r) => <PriorityBadge priority={r.priority} /> },
  {
    key: 'subtasks',
    header: 'Checklist',
    hideOnMobile: true,
    render: (r) => {
      const { done, total } = checklist(r);
      return <span className="text-sm text-muted tabular-nums">{total ? `${done}/${total}` : '—'}</span>;
    },
  },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <div onClick={stop} className="w-40">
        <Select
          aria-label={`Status of ${r.title}`}
          value={r.status || 'PENDING'}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          options={statusOptions}
          className="h-8 text-xs"
        />
      </div>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    hideOnMobile: true,
    render: (r) => (
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label={`Open ${r.title}`}
        onClick={(e) => {
          stop(e);
          setSelectedTaskId(r.id);
          setIsDetailModalOpen(true);
        }}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    ),
  },
];
