import React from 'react';
import { Eye } from 'lucide-react';

export const getTaskColumns = ({ setSelectedTaskId, setIsDetailModalOpen, handleStatusChange }) => [
  {
    header: 'Task Title & Client',
    key: 'title',
    render: (r) => (
      <div
        onClick={() => {
          setSelectedTaskId(r.id);
          setIsDetailModalOpen(true);
        }}
        className="cursor-pointer group"
      >
        <p className="font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors">
          {r.title}
        </p>
        <p className="text-xs text-slate-400">
          {r.client?.companyName || r.client?.clientName || 'Firm Internal Task'}
        </p>
      </div>
    ),
  },
  {
    header: 'Assigned Auditor(s)',
    key: 'assignees',
    render: (r) => (
      <div className="flex flex-wrap items-center gap-1 text-xs">
        {r.assignees && r.assignees.length > 0 ? (
          r.assignees.map((a) => (
            <span key={a.id} className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
              {a.user?.firstName} {a.user?.lastName}
            </span>
          ))
        ) : r.user ? (
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
            {r.user.firstName} {r.user.lastName}
          </span>
        ) : (
          <span className="text-slate-500 font-semibold">Unassigned</span>
        )}
      </div>
    ),
  },
  {
    header: 'Priority',
    key: 'priority',
    render: (r) => (
      <span
        className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
          r.priority === 'URGENT'
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            : r.priority === 'HIGH'
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}
      >
        {r.priority}
      </span>
    ),
  },
  {
    header: 'Subtasks',
    key: 'subtasks',
    render: (r) => {
      const total = r.subtasks?.length || r._count?.subtasks || 0;
      const done = r.subtasks?.filter((s) => s.isCompleted)?.length || 0;
      return (
        <span className="text-xs font-bold text-slate-300">
          {done}/{total} Items
        </span>
      );
    },
  },
  {
    header: 'Status',
    key: 'status',
    render: (r) => (
      <select
        value={r.status || 'PENDING'}
        onChange={(e) => handleStatusChange(r.id, e.target.value)}
        className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
      >
        <option value="PENDING">PENDING</option>
        <option value="IN_PROGRESS">IN PROGRESS</option>
        <option value="UNDER_REVIEW">UNDER REVIEW</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
    ),
  },
  {
    header: 'Actions',
    key: 'actions',
    render: (r) => (
      <button
        onClick={() => {
          setSelectedTaskId(r.id);
          setIsDetailModalOpen(true);
        }}
        className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
        title="Open Task Hub"
      >
        <Eye className="w-4 h-4"  />
      </button>
    ),
  },
];
