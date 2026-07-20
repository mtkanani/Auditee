import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { ChartCard } from '../../components/common/ChartCard';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FiLayers, FiCheckCircle, FiAlertOctagon, FiPlus, FiArrowUpRight } from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { superAdminService } from '../../services/superAdminService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [firms, setFirms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFirms = async () => {
    try {
      const res = await superAdminService.getAllFirms({ limit: 5 });
      setFirms(res.data || res.firms || []);
    } catch (error) {
      toast.error('Failed to load Super Admin dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFirms();
  }, []);

  // Growth Analytics Chart mock data
  const chartData = [
    { month: 'Jan', firms: 12, users: 120 },
    { month: 'Feb', firms: 19, users: 210 },
    { month: 'Mar', firms: 25, users: 340 },
    { month: 'Apr', firms: 32, users: 490 },
    { month: 'May', firms: 45, users: 680 },
    { month: 'Jun', firms: 58, users: 890 },
  ];

  const columns = [
    { header: 'Firm Name', key: 'firmName', render: (r) => <span className="font-semibold text-slate-100">{r.firmName}</span> },
    { header: 'Admin Email', key: 'email' },
    { header: 'City', key: 'city' },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      key: 'actions',
      render: (r) => (
        <button
          onClick={() => navigate('/super-admin/firms')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
        >
          <span>Manage</span>
          <FiArrowUpRight className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Super Admin Dashboard"
        subtitle="Global platform overview, CA firm tenants, and system metrics"
        actions={
          <button
            onClick={() => navigate('/super-admin/firms')}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Manage All Firms</span>
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Total CA Firms" value={firms.length || 58} icon={FiLayers} color="indigo" change="18%" />
        <StatsCard title="Active Tenants" value="52" icon={FiCheckCircle} color="emerald" change="12%" />
        <StatsCard title="Suspended / Inactive" value="6" icon={FiAlertOctagon} color="rose" trend="down" />
        <StatsCard title="Total Platform Users" value="1,240" icon={FiLayers} color="blue" change="24%" />
      </div>

      {/* Analytics Chart */}
      <ChartCard title="Platform Growth" subtitle="New CA firms onboarded vs total platform users">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="firmColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
            <Area type="monotone" dataKey="firms" stroke="#6366f1" fillOpacity={1} fill="url(#firmColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Recent Onboarded Firms */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Recently Onboarded CA Firms</h3>
        <DataTable columns={columns} data={firms} isLoading={isLoading} />
      </div>
    </div>
  );
};
