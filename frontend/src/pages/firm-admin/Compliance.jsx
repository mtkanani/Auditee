import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';

export const Compliance = () => {
  const complianceItems = [
    { id: 1, title: 'Quarterly GST Return (GSTR-3B)', client: 'ABC Pvt Ltd', dueDate: '2026-07-25', priority: 'HIGH', status: 'PENDING' },
    { id: 2, title: 'TDS Return Filing (Form 26Q)', client: 'XYZ Ltd', dueDate: '2026-07-31', priority: 'URGENT', status: 'IN_PROGRESS' },
    { id: 3, title: 'Annual Tax Audit (Form 3CD)', client: 'Demo Corp', dueDate: '2026-09-30', priority: 'MEDIUM', status: 'PENDING' },
    { id: 4, title: 'Advance Tax 2nd Installment', client: 'Global Traders', dueDate: '2026-09-15', priority: 'LOW', status: 'COMPLETED' },
  ];

  const columns = [
    { header: 'Compliance Item', key: 'title', render: (r) => <span className="font-bold text-slate-100">{r.title}</span> },
    { header: 'Client', key: 'client' },
    { header: 'Due Date', key: 'dueDate' },
    { header: 'Priority', key: 'priority', render: (r) => <PriorityBadge priority={r.priority} /> },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance & Filings Tracker"
        subtitle="Monitor statutory tax deadlines, GST filings, and audit schedules"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Total Compliance Tasks" value="28" icon={FiShield} color="indigo" />
        <StatsCard title="Pending Filings" value="12" icon={FiClock} color="amber" />
        <StatsCard title="Overdue Deadlines" value="2" icon={FiAlertTriangle} color="rose" />
        <StatsCard title="Completed This Month" value="14" icon={FiCheckCircle} color="emerald" />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Upcoming Statutory Compliance Items</h3>
        <DataTable columns={columns} data={complianceItems} />
      </div>
    </div>
  );
};
