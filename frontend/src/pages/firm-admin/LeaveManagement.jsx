import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ApplyLeaveModal } from '../../components/leave/ApplyLeaveModal';
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiUser,
  FiAlertTriangle,
  FiXCircle,
  FiGrid,
  FiList,
  FiCheck,
} from 'react-icons/fi';
import { leaveService } from '../../services/leaveService';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export const LeaveManagement = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'FIRM_ADMIN' || user?.role === 'ADMIN';

  const [myLeaveData, setMyLeaveData] = useState({ balance: null, requests: [] });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'calendar'

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(Boolean(location.state?.openApplyModal));
  const [adminRemarks, setAdminRemarks] = useState({});

  const fetchLeaveData = async () => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        const [myRes, pendRes, calRes] = await Promise.all([
          leaveService.getMyLeaveData(),
          leaveService.getPendingRequests(),
          leaveService.getLeaveCalendar({ month: selectedMonth, year: selectedYear }),
        ]);
        setMyLeaveData(myRes.data || { balance: null, requests: [] });
        setPendingRequests(pendRes.data?.pendingRequests || []);
        setCalendarEvents(calRes.data || []);
      } else {
        const [myRes, calRes] = await Promise.all([
          leaveService.getMyLeaveData(),
          leaveService.getLeaveCalendar({ month: selectedMonth, year: selectedYear }),
        ]);
        setMyLeaveData(myRes.data || { balance: null, requests: [] });
        setCalendarEvents(calRes.data || []);
      }
    } catch (err) {
      toast.error('Failed to load leave management data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [selectedMonth, selectedYear]);

  const handleAdminReview = async (id, status) => {
    const remarks = adminRemarks[id] || '';
    try {
      await leaveService.reviewLeave(id, status, remarks);
      toast.success(`Leave request ${status.toLowerCase()}!`);
      fetchLeaveData();
    } catch (err) {
      toast.error(err.message || `Failed to review leave`);
    }
  };

  const balance = myLeaveData.balance;

  const columns = [
    ...(isAdmin
      ? [
          {
            header: 'Applicant Employee',
            key: 'user',
            render: (r) => (
              <div>
                <p className="font-extrabold text-slate-100">{r.user?.firstName ? `${r.user.firstName} ${r.user.lastName}` : 'Staff User'}</p>
                <p className="text-xs text-slate-400">{r.user?.designation || 'Staff Auditor'}</p>
              </div>
            ),
          },
        ]
      : []),
    {
      header: 'Leave Type',
      key: 'leaveType',
      render: (r) => (
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {r.leaveType.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Dates & Duration',
      key: 'dates',
      render: (r) => (
        <div>
          <p className="text-xs font-bold text-amber-400 flex items-center gap-1">
            <FiCalendar /> {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
          </p>
          <p className="text-[10px] text-indigo-400 font-semibold">{r.totalDays} Day(s)</p>
        </div>
      ),
    },
    { header: 'Reason', key: 'reason', render: (r) => <span className="text-xs text-slate-300 line-clamp-1">{r.reason}</span> },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management System 🌴"
        subtitle="Apply for leave, track Casual/Sick/Earned Leave balances, review incoming applications, and view Leave Calendar"
        actions={
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        }
      />

      {/* Top Metrics / Quotas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Casual Leave (CL)"
          value={balance ? `${(balance.casualLeave - balance.casualLeaveUsed).toFixed(1)} / ${balance.casualLeave} Days` : '12 Days'}
          icon={FiCalendar}
          color="indigo"
        />
        <StatsCard
          title="Sick Leave (SL)"
          value={balance ? `${(balance.sickLeave - balance.sickLeaveUsed).toFixed(1)} / ${balance.sickLeave} Days` : '10 Days'}
          icon={FiClock}
          color="purple"
        />
        <StatsCard
          title="Earned Leave (EL)"
          value={balance ? `${(balance.earnedLeave - balance.earnedLeaveUsed).toFixed(1)} / ${balance.earnedLeave} Days` : '15 Days'}
          icon={FiCheckCircle}
          color="emerald"
        />
        <StatsCard
          title={isAdmin ? 'Pending Approval Inbox' : 'My Total Requests'}
          value={isAdmin ? pendingRequests.length : myLeaveData.requests?.length || 0}
          icon={FiAlertTriangle}
          color="amber"
        />
      </div>

      {/* View Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'requests' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiList />
            <span>{isAdmin ? `Admin Inbox (${pendingRequests.length}) & Logs` : 'My Leave History'}</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'calendar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiCalendar />
            <span>Leave Calendar Grid</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
              <option key={m} value={m}>
                {new Date(2026, m - 1, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: INBOX & LOGS */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Admin Pending Requests Approval Inbox Banner */}
          {isAdmin && pendingRequests.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-purple-950/40 to-slate-900 border border-amber-500/30 space-y-3 shadow-xl">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <FiAlertTriangle /> Pending Leave Applications Inbox ({pendingRequests.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingRequests.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-slate-100 text-xs">
                        {p.user?.firstName} {p.user?.lastName} ({p.user?.designation || 'Staff'})
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {p.leaveType.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-amber-300 font-semibold">
                      📅 {new Date(p.startDate).toLocaleDateString()} to {new Date(p.endDate).toLocaleDateString()} ({p.totalDays} Days)
                    </p>
                    <p className="text-xs text-slate-300"><strong>Reason:</strong> {p.reason}</p>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Admin remarks..."
                        value={adminRemarks[p.id] || ''}
                        onChange={(e) => setAdminRemarks({ ...adminRemarks, [p.id]: e.target.value })}
                        className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100"
                      />
                      <button
                        onClick={() => handleAdminReview(p.id, 'APPROVED')}
                        className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shadow"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAdminReview(p.id, 'REJECTED')}
                        className="py-1 px-3 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/20 font-bold text-xs whitespace-nowrap"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Master Table View */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <DataTable columns={columns} data={isAdmin ? pendingRequests : myLeaveData.requests} isLoading={isLoading} />
          </div>
        </div>
      )}

      {/* TAB 2: LEAVE CALENDAR GRID */}
      {activeTab === 'calendar' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FiCalendar className="text-indigo-400" />
            <span>Firm Approved Leave Calendar Grid</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {calendarEvents.map((ev) => (
              <div key={ev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-100 text-xs">
                    {ev.user?.firstName} {ev.user?.lastName}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    APPROVED
                  </span>
                </div>
                <p className="text-xs text-amber-400 font-bold">
                  📅 {new Date(ev.startDate).toLocaleDateString()} to {new Date(ev.endDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-400 line-clamp-2">Reason: {ev.reason}</p>
              </div>
            ))}

            {calendarEvents.length === 0 && (
              <div className="col-span-3 text-center py-12 text-xs text-slate-500">
                No approved employee leaves scheduled for this month.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={fetchLeaveData}
      />
    </div>
  );
};
