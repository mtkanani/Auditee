import React from 'react';
import { ChartCard } from '../../../components/common/ChartCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

// Theme colours as CSS variables, so the charts follow light and dark mode.
const C = {
  warning: 'var(--warning)',
  success: 'var(--success)',
  accent: 'var(--accent)',
  danger: 'var(--danger)',
  grid: 'var(--line)',
  axis: 'var(--subtle)',
};

const tooltipStyle = {
  contentStyle: { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--fg)', fontSize: 12 },
  labelStyle: { color: 'var(--muted)' },
  itemStyle: { color: 'var(--fg)' },
  cursor: { fill: 'var(--hover)' },
};

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const OverviewPanel = ({ summary }) => {
  if (!summary) return null;

  const workload = [
    { name: 'Pending', count: summary.totalPendingTasks, fill: C.warning },
    { name: 'Completed', count: summary.totalCompletedTasks, fill: C.success },
    { name: 'Compliance', count: summary.totalComplianceItems, fill: C.accent },
  ];
  const collections = [
    { name: 'Collected', value: summary.paidBilled, fill: C.success },
    { name: 'Outstanding', value: summary.outstandingAmount, fill: C.danger },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="Workload" subtitle="Pending and completed tasks, and compliance filings">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={workload} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
            <XAxis dataKey="name" stroke={C.axis} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={C.axis} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="count" name="Count" radius={[8, 8, 0, 0]} maxBarSize={64}>
              {workload.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Collections" subtitle="Billed amount collected so far versus still outstanding">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={collections} cx="50%" cy="45%" innerRadius="55%" outerRadius="80%" paddingAngle={4} dataKey="value" stroke="var(--surface)">
              {collections.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} formatter={(v) => inr(v)} />
            <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12, color: 'var(--muted)' }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};
