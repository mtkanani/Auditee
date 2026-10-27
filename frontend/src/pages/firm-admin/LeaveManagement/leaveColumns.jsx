import React from 'react';
import { Calendar } from 'lucide-react';
import { StatusBadge } from '../../../components/common/StatusBadge';

export const getLeaveColumns = ({ isAdmin, activeTab, handleAdminReview }) => [
  ...(isAdmin && activeTab !== 'my_leaves'
    ? [
        {
          header: 'Applicant Employee',
          key: 'user',
          render: (r) => (
            <div>
              <p className="font-extrabold text-slate-100">{r.user?.firstName ? `${r.user.firstName} ${r.user.lastName}` : 'Staff User'}</p>
              <p className="text-xs text-slate-400">{r.user?.designation || 'Staff Auditor'}</p>
            </div>
          ),
        },
      ]
    : []),
  {
    header: 'Leave Type',
    key: 'leaveType',
    render: (r) => (
      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
        {r.leaveType.replace('_', ' ')}
      </span>
    ),
  },
  {
    header: 'Dates & Duration',
    key: 'dates',
    render: (r) => (
      <div>
        <p className="text-xs font-bold text-amber-400 flex items-center gap-1">
          <Calendar size="1em" /> {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
        </p>
        <p className="text-[10px] text-indigo-400 font-semibold">{r.totalDays} Day(s)</p>
      </div>
    ),
  },
  { header: 'Reason', key: 'reason', render: (r) => <span className="text-xs text-slate-300 line-clamp-1">{r.reason}</span> },
  { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ...(isAdmin && (activeTab === 'pending' || activeTab === 'all_firm')
    ? [
        {
          header: 'Review Actions',
          key: 'actions',
          render: (r) =>
            r.status === 'PENDING' ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleAdminReview(r.id, 'APPROVED')}
                  className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAdminReview(r.id, 'REJECTED')}
                  className="py-1 px-3 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/20 font-bold text-xs"
                >
                  Reject
                </button>
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">{r.adminRemarks || 'Reviewed'}</span>
            ),
        },
      ]
    : []),
];
