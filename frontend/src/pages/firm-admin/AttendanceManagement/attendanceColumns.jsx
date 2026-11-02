import React from 'react';
import { Avatar } from '../../../components/common/Avatar';
import { StatusTag } from '../../../components/ui';
import { Punch } from './Punch';

export const getAttendanceColumns = ({ isAdmin }) => [
  ...(isAdmin
    ? [
        {
          key: 'user',
          header: 'Employee',
          render: (r) => (
            <div className="flex items-center gap-3 min-w-0">
              <Avatar firstName={r.user?.firstName} lastName={r.user?.lastName} size="sm" className="shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-fg truncate max-w-[200px]">{r.user?.firstName ? `${r.user.firstName} ${r.user.lastName}` : 'Staff User'}</p>
                <p className="text-xs text-subtle truncate max-w-[200px]">{r.user?.designation || 'Auditor'}</p>
              </div>
            </div>
          ),
        },
      ]
    : []),
  {
    key: 'date',
    header: 'Date',
    render: (r) => (
      <span className="text-sm text-fg tabular-nums whitespace-nowrap">
        {new Date(r.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
      </span>
    ),
  },
  { key: 'checkInTime', header: 'Checked in', render: (r) => <Punch at={r.checkInTime} place={r.checkInLocation || (r.checkInTime && 'Verified location')} empty="—" /> },
  { key: 'checkOutTime', header: 'Checked out', render: (r) => <Punch at={r.checkOutTime} place={r.checkOutLocation} empty="Not yet" /> },
  {
    key: 'workingHours',
    header: 'Hours',
    align: 'right',
    render: (r) => <span className="text-sm font-medium text-fg tabular-nums">{Number(r.workingHours || 0).toFixed(1)} h</span>,
  },
  { key: 'status', header: 'Status', render: (r) => <StatusTag status={r.status} /> },
];
