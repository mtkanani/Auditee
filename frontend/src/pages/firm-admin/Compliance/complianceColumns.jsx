import React from 'react';
import { Bell, Calendar, Zap } from 'lucide-react';

export const getComplianceColumns = ({ handleStatusChange, setSelectedItem, setIsTaskModalOpen, handleSendReminder }) => [
  {
    header: 'Compliance Filing Item',
    key: 'title',
    render: (r) => (
      <div>
        <p className="font-extrabold text-slate-100">{r.title}</p>
        <p className="text-xs text-slate-400">
          Period: {r.period || 'N/A'} • Client: {r.client?.companyName || r.client?.clientName || 'All Firm Clients'}
        </p>
        {r.penaltyDetails && <p className="text-[10px] text-amber-400 font-semibold mt-0.5">{r.penaltyDetails}</p>}
      </div>
    ),
  },
  {
    header: 'Category',
    key: 'category',
    render: (r) => (
      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        {r.category}
      </span>
    ),
  },
  {
    header: 'Due Date',
    key: 'dueDate',
    render: (r) => (
      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
        <Calendar size="1em" /> {new Date(r.dueDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (r) => (
      <select
        value={r.status || 'UPCOMING'}
        onChange={(e) => handleStatusChange(r.id, e.target.value)}
        className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
      >
        <option value="UPCOMING">UPCOMING</option>
        <option value="IN_PROGRESS">IN PROGRESS</option>
        <option value="FILED">FILED</option>
        <option value="OVERDUE">OVERDUE</option>
        <option value="EXTENDED">EXTENDED</option>
      </select>
    ),
  },
  {
    header: 'Actions',
    key: 'actions',
    render: (r) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setSelectedItem(r);
            setIsTaskModalOpen(true);
          }}
          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 text-xs font-bold flex items-center gap-1"
          title="Convert to Task"
        >
          <Zap size="1em" />
          <span>Task</span>
        </button>

        <button
          onClick={() => handleSendReminder(r)}
          className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
          title="Broadcast Notice Reminder"
        >
          <Bell className="w-4 h-4"  />
        </button>
      </div>
    ),
  },
];
