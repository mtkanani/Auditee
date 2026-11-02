import React from 'react';
import { Bell, Zap } from 'lucide-react';
import { Badge, Button, Select } from '../../../components/ui';
import { dueLabel } from '../../../utils/dueDate';
import { STATUSES, categoryLabel, shortDate } from './options';

const TABLE_STATUSES = [...STATUSES, { value: 'EXTENDED', label: 'Extended' }];

export const getComplianceColumns = ({ handleStatusChange, setSelectedItem, setIsTaskModalOpen, handleSendReminder }) => [
  {
    key: 'title',
    header: 'Filing',
    render: (r) => (
      <div className="min-w-0">
        <p className="font-medium text-fg truncate max-w-[300px]">{r.title}</p>
        <p className="text-xs text-subtle truncate max-w-[300px]">
          {[r.period, r.client?.companyName || r.client?.clientName || 'All clients'].filter(Boolean).join(' · ')}
        </p>
        {r.penaltyDetails && <p className="text-xs text-warning mt-0.5 truncate max-w-[300px]">{r.penaltyDetails}</p>}
      </div>
    ),
  },
  { key: 'category', header: 'Category', render: (r) => <Badge tone="accent">{categoryLabel(r.category)}</Badge> },
  {
    key: 'dueDate',
    header: 'Due',
    render: (r) => {
      const due = r.status === 'FILED' ? null : dueLabel(r.dueDate);
      return (
        <div className="space-y-1">
          <p className="text-sm text-fg tabular-nums">{shortDate(r.dueDate)}</p>
          {due && <Badge tone={due.tone} dot>{due.text}</Badge>}
        </div>
      );
    },
  },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <div className="w-36">
        <Select
          aria-label={`Status of ${r.title}`}
          value={r.status || 'UPCOMING'}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          options={TABLE_STATUSES}
          className="h-8 text-xs"
        />
      </div>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (r) => (
      <div className="flex justify-end gap-1">
        <Button
          size="sm"
          variant="soft"
          icon={Zap}
          onClick={() => {
            setSelectedItem(r);
            setIsTaskModalOpen(true);
          }}
        >
          Task
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label={`Send reminder for ${r.title}`} onClick={() => handleSendReminder(r)}>
          <Bell className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
