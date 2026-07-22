import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiAlertTriangle,
  FiUserCheck,
  FiCalendar,
  FiZap,
} from 'react-icons/fi';
import { attendanceService } from '../../services/attendanceService';
import { firmAdminService } from '../../services/firmAdminService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const AttendanceManagement = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'FIRM_ADMIN' || user?.role === 'ADMIN';

  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        const [repRes, userRes] = await Promise.all([
          attendanceService.getFirmReport({ month: selectedMonth, year: selectedYear, search, userId: selectedUser || undefined }),
          firmAdminService.getUsers({ limit: 100 }),
        ]);
        setLogs(repRes.data || []);
        setUsers(userRes.data || userRes.users || []);
      } else {
        const myRes = await attendanceService.getMyLogs({ month: selectedMonth, year: selectedYear });
        setLogs(myRes.data || []);
      }
    } catch (err) {
      toast.error('Failed to load attendance logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear, search, selectedUser]);

  // Stats calculation
  const totalPresent = logs.filter((l) => l.status === 'PRESENT').length;
  const halfDays = logs.filter((l) => l.status === 'HALF_DAY').length;
  const totalHoursWorked = logs.reduce((acc, curr) => acc + (curr.workingHours || 0), 0);
  const avgHoursPerDay = logs.length > 0 ? (totalHoursWorked / logs.length).toFixed(1) : '0.0';

  const columns = [
    ...(isAdmin
      ? [
          {
            header: 'Employee Name',
            key: 'user',
            render: (r) => (
              <div>
                <p className="font-extrabold text-slate-100">{r.user?.firstName ? `${r.user.firstName} ${r.user.lastName}` : 'Staff User'}</p>
                <p className="text-xs text-slate-400">{r.user?.designation || 'Auditor'} • {r.user?.email}</p>
              </div>
            ),
          },
        ]
      : []),
    {
      header: 'Date',
      key: 'date',
      render: (r) => (
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <FiCalendar className="text-indigo-400" /> {new Date(r.date).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Check In Time & GPS',
      key: 'checkInTime',
      render: (r) => (
        <div>
          <p className="font-extrabold text-emerald-400">
            {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
          </p>
          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
            <FiMapPin className="text-emerald-400" /> {r.checkInLocation || 'Verified Location'}
          </p>
        </div>
      ),
    },
    {
      header: 'Check Out Time & GPS',
      key: 'checkOutTime',
      render: (r) => (
        <div>
          <p className="font-extrabold text-rose-400">
            {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not Checked Out'}
          </p>
          {r.checkOutLocation && (
            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <FiMapPin className="text-rose-400" /> {r.checkOutLocation}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Working Hours',
      key: 'workingHours',
      render: (r) => (
        <span className="text-xs font-black text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
          {r.workingHours || 0.0} Hrs
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAdmin ? 'Firm Attendance Control Center' : 'My Attendance & Working Hours ⏰'}
        subtitle="GPS Location Verified Check-In & Check-Out, Daily Working Hours Calculation, and Monthly Attendance Reports"
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Present Days" value={totalPresent} icon={FiCheckCircle} color="emerald" />
        <StatsCard title="Half Days / Short Hours" value={halfDays} icon={FiAlertTriangle} color="amber" />
        <StatsCard title="Total Hours Worked" value={`${totalHoursWorked.toFixed(1)} Hrs`} icon={FiClock} color="indigo" />
        <StatsCard title="Avg Working Hours / Day" value={`${avgHoursPerDay} Hrs`} icon={FiUserCheck} color="purple" />
      </div>

      {/* Control Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
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

        {isAdmin && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SearchBar value={search} onChange={setSearch} placeholder="Search employee name..." className="w-full sm:w-56" />

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
            >
              <option value="">All Staff Employees</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Attendance Log Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <DataTable columns={columns} data={logs} isLoading={isLoading} />
      </div>
    </div>
  );
};
