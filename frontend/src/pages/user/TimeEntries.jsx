import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { DataTable } from '../../components/common/DataTable';
import { FiClock, FiCalendar, FiCheckCircle } from 'react-icons/fi';

export const TimeEntries = () => {
  const timeLogs = [
    { id: 1, date: '2026-07-20', client: 'ABC Pvt Ltd', task: 'GST GSTR-3B Reconciliation', hours: '3.5 hrs', notes: 'Checked invoice tax credits' },
    { id: 2, date: '2026-07-19', client: 'XYZ Ltd', task: 'TDS Deduction Verification', hours: '4.0 hrs', notes: 'Form 26Q return preparation' },
    { id: 3, date: '2026-07-18', client: 'Demo Corp', task: 'Income Tax Audit', hours: '2.5 hrs', notes: '3CD annexure review' },
  ];

  const columns = [
    { header: 'Date', key: 'date' },
    { header: 'Client Name', key: 'client', render: (r) => <span className="font-bold text-slate-100">{r.client}</span> },
    { header: 'Task / Work Item', key: 'task' },
    { header: 'Hours Logged', key: 'hours', render: (r) => <span className="font-bold text-indigo-400">{r.hours}</span> },
    { header: 'Notes', key: 'notes' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Entries & Logged Hours"
        subtitle="Review your logged audit hours, billable task times, and work notes"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard title="Hours Logged Today" value="6.5 hrs" icon={FiClock} color="indigo" />
        <StatsCard title="Hours Logged This Week" value="32.0 hrs" icon={FiCalendar} color="emerald" />
        <StatsCard title="Total Billable Entries" value="48" icon={FiCheckCircle} color="blue" />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Recent Time Log History</h3>
        <DataTable columns={columns} data={timeLogs} />
      </div>
    </div>
  );
};
