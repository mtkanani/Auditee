import React, { useEffect, useState } from 'react';
import {
  FiUsers, FiBriefcase, FiCheckSquare, FiShield,
  FiPlus, FiUserPlus, FiTrendingUp, FiArrowRight,
  FiCalendar, FiDollarSign, FiActivity, FiZap,
  FiAward, FiTarget, FiClock, FiBarChart2,
} from 'react-icons/fi';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend,
} from 'recharts';
import { firmAdminService } from '../../services/firmAdminService';
import { AttendanceWidget } from '../../components/attendance/AttendanceWidget';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const monthlyData = [
  { month: 'Feb', gst: 42, tax: 28, audit: 15 },
  { month: 'Mar', gst: 58, tax: 45, audit: 22 },
  { month: 'Apr', gst: 48, tax: 32, audit: 18 },
  { month: 'May', gst: 62, tax: 50, audit: 30 },
  { month: 'Jun', gst: 71, tax: 55, audit: 35 },
  { month: 'Jul', gst: 80, tax: 62, audit: 40 },
];

const revenueData = [
  { month: 'Feb', revenue: 285000 },
  { month: 'Mar', revenue: 320000 },
  { month: 'Apr', revenue: 290000 },
  { month: 'May', revenue: 410000 },
  { month: 'Jun', revenue: 380000 },
  { month: 'Jul', revenue: 450000 },
];

const taskPie = [
  { name: 'Done', value: 26, color: '#10b981' },
  { name: 'In Progress', value: 8, color: '#6366f1' },
  { name: 'Pending', value: 14, color: '#f59e0b' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 shadow-xl text-xs">
        <p className="font-bold text-slate-300 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const quickActions = [
  { label: 'Add Client', icon: FiBriefcase, color: 'from-indigo-600 to-purple-600', shadow: 'shadow-indigo-500/25', path: '/firm-admin/clients' },
  { label: 'Add Employee', icon: FiUserPlus, color: 'from-emerald-600 to-teal-600', shadow: 'shadow-emerald-500/25', path: '/firm-admin/users' },
  { label: 'New Invoice', icon: FiDollarSign, color: 'from-amber-600 to-orange-600', shadow: 'shadow-amber-500/25', path: '/firm-admin/billing' },
  { label: 'Compliance', icon: FiShield, color: 'from-rose-600 to-pink-600', shadow: 'shadow-rose-500/25', path: '/firm-admin/compliance' },
];

const recentActivity = [
  { icon: '🧾', text: 'GST Return filed for ABC Pvt Ltd', time: '5m ago', color: 'text-emerald-400' },
  { icon: '👤', text: 'New employee Priya Sharma onboarded', time: '1h ago', color: 'text-indigo-400' },
  { icon: '📋', text: 'Audit report submitted — XYZ Corp', time: '3h ago', color: 'text-amber-400' },
  { icon: '⚠️', text: 'TDS return due in 3 days for 4 clients', time: '5h ago', color: 'text-rose-400' },
  { icon: '💰', text: 'Invoice #INV-082 paid — ₹48,500', time: '1d ago', color: 'text-teal-400' },
];

export const FirmAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await firmAdminService.getDashboard();
        setData(res.data || res);
      } catch (error) {
        toast.error('Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const kpiCards = [
    {
      label: 'Total Clients',
      value: data?.metrics?.totalClients ?? 42,
      icon: FiBriefcase,
      change: '+14%',
      trend: 'up',
      gradient: 'from-indigo-500 to-purple-600',
      bg: 'from-indigo-500/10 to-purple-500/5',
      border: 'border-indigo-500/20',
      glow: 'shadow-indigo-500/10',
    },
    {
      label: 'Total Employees',
      value: data?.metrics?.totalUsers ?? 18,
      icon: FiUsers,
      change: '+8%',
      trend: 'up',
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/10',
    },
    {
      label: 'Pending Tasks',
      value: data?.metrics?.pendingTasks ?? 14,
      icon: FiCheckSquare,
      change: '-3%',
      trend: 'down',
      gradient: 'from-amber-500 to-orange-600',
      bg: 'from-amber-500/10 to-orange-500/5',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
    },
    {
      label: 'Compliance Due',
      value: data?.metrics?.pendingCompliance ?? 5,
      icon: FiShield,
      change: 'Urgent',
      trend: 'down',
      gradient: 'from-rose-500 to-pink-600',
      bg: 'from-rose-500/10 to-pink-500/5',
      border: 'border-rose-500/20',
      glow: 'shadow-rose-500/10',
    },
  ];

  return (
    <div className="min-h-screen space-y-6 pb-8">

      {/* ── HERO BANNER ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👋</span>
              <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{greeting}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Firm Admin'}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-md">
              Here's your firm's performance overview for{' '}
              <span className="text-indigo-300 font-semibold">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r ${a.color} text-white font-bold text-xs shadow-lg ${a.shadow} hover:scale-105 transition-all duration-200`}
              >
                <a.icon className="w-3.5 h-3.5" />
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mini KPI strip */}
        <div className="relative grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-700/50">
          {[
            { label: 'Revenue This Month', value: '₹4.5L', icon: '💰', up: true },
            { label: 'Active Audits', value: '12', icon: '📋', up: true },
            { label: 'Overdue Items', value: '3', icon: '⚠️', up: false },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <span className="text-xl">{s.icon}</span>
              <p className="text-lg font-extrabold text-white mt-0.5">{s.value}</p>
              <p className="text-[10px] text-slate-500 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── KPI CARDS + ATTENDANCE ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* KPI Cards (2/3) */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {kpiCards.map((k) => (
            <div
              key={k.label}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${k.bg} border ${k.border} p-5 shadow-xl hover:shadow-2xl ${k.glow} transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
            >
              {/* Glow orb */}
              <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${k.gradient} opacity-20 rounded-full blur-xl`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.gradient} flex items-center justify-center shadow-lg`}>
                  <k.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  k.trend === 'up'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-rose-500/15 text-rose-400'
                }`}>
                  {k.trend === 'up' ? '↑' : '↓'} {k.change}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{k.label}</p>
              <p className="text-4xl font-black text-white">{isLoading ? '—' : k.value}</p>

              {/* Bottom progress bar */}
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-800">
                <div className={`h-full bg-gradient-to-r ${k.gradient} w-2/3 opacity-60`} />
              </div>
            </div>
          ))}
        </div>

        {/* Attendance Widget (1/3) */}
        <div className="lg:col-span-1">
          <AttendanceWidget />
        </div>
      </div>

      {/* ── CHARTS ROW ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Area chart — Revenue Trend (2/3) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-100">Revenue Trend</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Monthly billing performance (₹)</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <FiTrendingUp className="w-3 h-3" />
              +18.4% this month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 6 }} name="Revenue (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — Task Breakdown (1/3) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="mb-4">
            <h3 className="text-sm font-extrabold text-slate-100">Task Status</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Current work distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={taskPie} innerRadius={50} outerRadius={72} paddingAngle={4} dataKey="value" startAngle={90} endAngle={-270}>
                {taskPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {taskPie.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-slate-400 font-semibold">{t.name}</span>
                </div>
                <span className="font-extrabold text-slate-200">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BAR CHART + ACTIVITY ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar chart — Filing Volume (2/3) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-100">Filing Volume</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">GST, Income Tax & Audit filings per month</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> GST</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Income Tax</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Audit</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barGap={4} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="gst" name="GST" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tax" name="Income Tax" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="audit" name="Audit" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Feed (1/3) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-100">Recent Activity</h3>
            <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5">
              View all <FiArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3 items-start group">
                <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm flex-shrink-0 group-hover:border-slate-600 transition-colors">
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-300 leading-snug line-clamp-2">{a.text}</p>
                  <span className={`text-[9px] font-bold ${a.color} mt-0.5 block`}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PERFORMANCE GOALS ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Client Acquisition', current: 42, target: 60, color: '#6366f1', icon: FiTarget },
          { label: 'Tasks Completion Rate', current: 72, target: 100, color: '#10b981', icon: FiZap },
          { label: 'Compliance Score', current: 89, target: 100, color: '#f59e0b', icon: FiAward },
        ].map((g) => {
          const pct = Math.round((g.current / g.target) * 100);
          return (
            <div key={g.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${g.color}20` }}>
                  <g.icon className="w-4 h-4" style={{ color: g.color }} />
                </div>
                <p className="text-xs font-bold text-slate-300">{g.label}</p>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-extrabold text-white">{g.current}</span>
                <span className="text-[10px] text-slate-500 font-bold">/ {g.target}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, backgroundColor: g.color, boxShadow: `0 0 8px ${g.color}60` }}
                />
              </div>
              <p className="text-[10px] font-bold mt-1.5" style={{ color: g.color }}>{pct}% achieved</p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
