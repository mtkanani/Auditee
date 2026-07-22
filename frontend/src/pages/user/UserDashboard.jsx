import React, { useEffect, useState } from 'react';
import { FiBriefcase, FiCheckSquare, FiClock, FiCheckCircle, FiUser, FiArrowRight, FiTrendingUp, FiBarChart2, FiCalendar, FiTarget } from 'react-icons/fi';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { AttendanceWidget } from '../../components/attendance/AttendanceWidget';
import { NoticeBanner } from '../../components/announcements/NoticeBanner';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

// Mock data – replace with real API when available
const monthlyTaskData = [
  { month: 'Feb', completed: 12, pending: 5 },
  { month: 'Mar', completed: 18, pending: 3 },
  { month: 'Apr', completed: 15, pending: 4 },
  { month: 'May', completed: 22, pending: 2 },
  { month: 'Jun', completed: 19, pending: 3 },
  { month: 'Jul', completed: 25, pending: 1 },
];

const taskStatusPie = [
  { name: 'Done', value: 68, color: '#10b981' },
  { name: 'In Progress', value: 22, color: '#6366f1' },
  { name: 'Pending', value: 10, color: '#f59e0b' },
];

const recentActivity = [
  { icon: '🧾', text: 'Submitted timesheet for June', time: '30m ago', color: 'text-emerald-400' },
  { icon: '📂', text: 'New client "TechNova" assigned', time: '2h ago', color: 'text-indigo-400' },
  { icon: '✅', text: 'Task "Audit Preparation" marked complete', time: '5h ago', color: 'text-amber-400' },
  { icon: '⚠️', text: 'Compliance reminder for GST due', time: '1d ago', color: 'text-rose-400' },
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

export const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await userService.getDashboard();
        setData(res.data || res);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await userService.updateTaskStatus(taskId, newStatus);
      toast.success('Task status updated');
      const res = await userService.getDashboard();
      setData(res.data || res);
    } catch (e) {
      toast.error(e.message || 'Failed to update task');
    }
  };

  const kpiCards = [
    { label: 'Assigned Clients', value: data?.metrics?.assignedClients ?? 8, icon: FiBriefcase, color: 'indigo', change: '+12%', trend: 'up' },
    { label: 'Pending Tasks', value: data?.metrics?.pendingTasks ?? 5, icon: FiCheckSquare, color: 'amber', change: '-4%', trend: 'down' },
    { label: 'Completed Tasks', value: data?.metrics?.completedTasks ?? 18, icon: FiCheckCircle, color: 'emerald', change: '+22%', trend: 'up' },
    { label: "Today's Logged Hours", value: data?.metrics?.todayTime || '6h 30m', icon: FiClock, color: 'blue', change: '+5%', trend: 'up' },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen space-y-6 pb-8">
      {/* ── HERO ────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-transparent to-purple-600/10 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {greeting}, {data?.user?.firstName || 'Employee'}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-md">
              Your personal dashboard – stay on top of clients, tasks and time.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md hover:scale-105 transition" onClick={() => window.location.href = '/user/tasks'}>
              <FiBarChart2 className="w-3 h-3" /> My Tasks
            </button>
            <button className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-md hover:scale-105 transition" onClick={() => window.location.href = '/user/timesheet'}>
              <FiCalendar className="w-3 h-3" /> Timesheet
            </button>
          </div>
        </div>
      </div>

      <NoticeBanner />

      {/* KPI + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {kpiCards.map((k) => (
            <div
              key={k.label}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${k.color === 'indigo' ? 'from-indigo-500/10 to-purple-500/5' : ''} ${k.color === 'amber' ? 'from-amber-500/10 to-orange-500/5' : ''} ${k.color === 'emerald' ? 'from-emerald-500/10 to-teal-500/5' : ''} ${k.color === 'blue' ? 'from-blue-500/10 to-cyan-500/5' : ''} border border-slate-800 p-5 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.color === 'indigo' ? 'from-indigo-600 to-purple-600' : ''} ${k.color === 'amber' ? 'from-amber-600 to-orange-600' : ''} ${k.color === 'emerald' ? 'from-emerald-600 to-teal-600' : ''} ${k.color === 'blue' ? 'from-blue-600 to-cyan-600' : ''} flex items-center justify-center shadow-md`}
                >
                  <k.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${k.trend === 'up' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}> {k.trend === 'up' ? '↑' : '↓'} {k.change} </span>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{k.label}</p>
              <p className="text-4xl font-black text-white">{isLoading ? '—' : k.value}</p>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <AttendanceWidget />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-100">Task Volume</h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <FiTrendingUp className="inline w-3 h-3 mr-1" />
              +18% month over month
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyTaskData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-extrabold text-slate-100 mb-3">Task Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={taskStatusPie} innerRadius={50} outerRadius={72} dataKey="value" paddingAngle={4} startAngle={90} endAngle={-270}>
                {taskStatusPie.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {taskStatusPie.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-slate-400 font-semibold">{t.name}</span>
                </div>
                <span className="font-extrabold text-slate-200">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-100">Recent Activity</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5">
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-extrabold text-slate-100 mb-3">My Tasks</h3>
          <KanbanBoard tasks={data?.tasks || []} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
};
