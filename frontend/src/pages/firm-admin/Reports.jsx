import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ChartCard } from '../../components/common/ChartCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { FiDownload } from 'react-icons/fi';

export const Reports = () => {
  const productivityData = [
    { name: 'Rahul', tasks: 14, hours: 120 },
    { name: 'Amit', tasks: 18, hours: 145 },
    { name: 'Priya', tasks: 22, hours: 160 },
    { name: 'Dhruv', tasks: 11, hours: 98 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Firm Performance & Audit Reports"
        subtitle="Staff productivity, billable time analysis, and compliance metrics"
        actions={
          <button className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-800 flex items-center gap-2">
            <FiDownload className="w-4 h-4" />
            <span>Export Analytics Report</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Employee Task Completion Rate" subtitle="Total tasks completed per staff member">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Logged Billable Hours" subtitle="Total work hours logged this month">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
