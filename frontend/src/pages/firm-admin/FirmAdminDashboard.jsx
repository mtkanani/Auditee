import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { ChartCard } from '../../components/common/ChartCard';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FiUsers, FiBriefcase, FiCheckSquare, FiShield, FiPlus, FiUserPlus, FiFileText } from 'react-icons/fi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { firmAdminService } from '../../services/firmAdminService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const FirmAdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await firmAdminService.getDashboard();
        setData(res.data || res);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const taskDistribution = [
    { name: 'Pending', value: data?.metrics?.pendingTasks || 14, color: '#f59e0b' },
    { name: 'In Progress', value: 8, color: '#6366f1' },
    { name: 'Completed', value: 26, color: '#10b981' },
  ];

  const recentUsersColumns = [
    { header: 'Employee Name', key: 'name', render: (r) => <span className="font-semibold text-slate-100">{r.firstName ? `${r.firstName} ${r.lastName}` : r.name}</span> },
    { header: 'Email', key: 'email' },
    { header: 'Designation', key: 'designation', render: (r) => r.designation || 'CA Staff' },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status || 'ACTIVE'} /> },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Firm Admin Dashboard"
        subtitle="Manage your CA firm's clients, employee assignments, tasks, and compliance"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/firm-admin/clients')}
              className="py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <FiPlus className="w-4 h-4 text-indigo-400" />
              <span>Add Client</span>
            </button>
            <button
              onClick={() => navigate('/firm-admin/users')}
              className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>
        }
      />

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Clients"
          value={data?.metrics?.totalClients || 42}
          icon={FiBriefcase}
          color="indigo"
          change="14%"
        />
        <StatsCard
          title="Total Employees"
          value={data?.metrics?.totalUsers || 18}
          icon={FiUsers}
          color="emerald"
          change="8%"
        />
        <StatsCard
          title="Pending Tasks"
          value={data?.metrics?.pendingTasks || 14}
          icon={FiCheckSquare}
          color="amber"
          trend="down"
        />
        <StatsCard
          title="Pending Compliance"
          value={data?.metrics?.pendingCompliance || 5}
          icon={FiShield}
          color="rose"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Task Status Breakdown" subtitle="Distribution of work requests" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={taskDistribution} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                {taskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Audit & Filing Volume" subtitle="GST & Income Tax filings completed" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { month: 'Jan', gst: 35, tax: 20 },
              { month: 'Feb', gst: 42, tax: 28 },
              { month: 'Mar', gst: 58, tax: 45 },
              { month: 'Apr', gst: 48, tax: 32 },
              { month: 'May', gst: 62, tax: 50 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Bar dataKey="gst" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tax" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-100">Recent Employee Additions</h3>
          <button
            onClick={() => navigate('/firm-admin/users')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            View All Users →
          </button>
        </div>
        <DataTable columns={recentUsersColumns} data={data?.recentUsers || []} isLoading={isLoading} />
      </div>
    </div>
  );
};
