import React from 'react';
import { Check, X } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { Badge, Button, StatusTag } from '../../../components/ui';
import { leaveTypeLabel, dateRange, daysLabel } from './leaveFormat';

export const getLeaveColumns = ({ isAdmin, activeTab, handleAdminReview }) => [
  ...(isAdmin && activeTab !== 'my_leaves'
    ? [
        {
          key: 'user',
          header: 'Employee',
          render: (r) => (
            <div className="flex items-center gap-3 min-w-0">
              <Avatar firstName={r.user?.firstName} lastName={r.user?.lastName} size="sm" className="shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-fg truncate max-w-[200px]">{r.user?.firstName ? `${r.user.firstName} ${r.user.lastName}` : 'Staff User'}</p>
                <p className="text-xs text-subtle truncate max-w-[200px]">{r.user?.designation || 'Staff Auditor'}</p>
              </div>
            </div>
          ),
        },
      ]
    : []),
  { key: 'leaveType', header: 'Type', render: (r) => <Badge tone="accent">{leaveTypeLabel(r.leaveType)}</Badge> },
  {
    key: 'dates',
    header: 'Dates',
    render: (r) => (
      <div>
        <p className="text-sm text-fg tabular-nums whitespace-nowrap">{dateRange(r.startDate, r.endDate)}</p>
        <p className="text-xs text-subtle">{daysLabel(r.totalDays)}</p>
      </div>
    ),
  },
  { key: 'reason', header: 'Reason', render: (r) => <span className="text-muted line-clamp-1 max-w-[260px]">{r.reason}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusTag status={r.status} /> },
  ...(isAdmin && (activeTab === 'pending' || activeTab === 'all_firm')
    ? [
        {
          key: 'actions',
          header: '',
          align: 'right',
          render: (r) =>
            r.status === 'PENDING' ? (
              <div className="flex justify-end gap-1.5">
                <Button size="sm" variant="danger" icon={X} onClick={() => handleAdminReview(r.id, 'REJECTED')}>Reject</Button>
                <Button size="sm" variant="primary" icon={Check} onClick={() => handleAdminReview(r.id, 'APPROVED')}>Approve</Button>
              </div>
            ) : (
              <span className="text-xs text-subtle">{r.adminRemarks || 'Reviewed'}</span>
            ),
        },
      ]
    : []),
];
