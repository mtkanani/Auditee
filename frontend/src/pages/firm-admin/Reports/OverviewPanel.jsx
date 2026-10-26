import React from 'react';
import { ChartCard } from '../../../components/common/ChartCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const OverviewPanel = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Task & Audit Workload Metrics" subtitle="Pending vs Completed vs Compliance ratio">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={[
                { name: 'Pending Tasks', count: summary.totalPendingTasks, fill: '#f59e0b' },
                { name: 'Completed Tasks', count: summary.totalCompletedTasks, fill: '#10b981' },
                { name: 'Compliance Filings', count: summary.totalComplianceItems, fill: '#6366f1' },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Billing vs Outstanding Collections" subtitle="Paid revenue vs pending invoice balance">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Paid Revenue', value: summary.paidBilled },
                  { name: 'Outstanding Dues', value: summary.outstandingAmount },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
