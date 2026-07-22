import React, { useState, useEffect } from 'react';
import {
  FiMenu,
  FiBell,
  FiSun,
  FiMoon,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiCheckCircle,
  FiClock,
  FiMapPin,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from './Avatar';
import { formatRoleName } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../../services/attendanceService';
import toast from 'react-hot-toast';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout, getRoleDashboardPath } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Attendance Widget State
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);

  // Sample system notifications
  const [notifications] = useState([
    { id: 1, title: 'New Work Request', desc: 'ABC Pvt Ltd submitted GST filing request', time: '5m ago' },
    { id: 2, title: 'Task Completed', desc: 'Amit completed Income Tax Audit Report', time: '1h ago' },
    { id: 3, title: 'Compliance Reminder', desc: 'Quarterly TDS Return due in 3 days', time: '3h ago' },
  ]);

  const fetchAttendanceStatus = async () => {
    if (!user || user.role === 'SUPER_ADMIN') return;
    try {
      const res = await attendanceService.getTodayStatus();
      setAttendanceStatus(res.data);
    } catch (err) {
      console.log('Error fetching today attendance status:', err);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
  }, [user]);

  const handleGPSCheckIn = async () => {
    setIsAttendanceLoading(true);
    const getCoordinates = () =>
      new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => resolve({ lat: null, lng: null })
          );
        } else {
          resolve({ lat: null, lng: null });
        }
      });

    try {
      const coords = await getCoordinates();
      await attendanceService.checkIn({
        lat: coords.lat,
        lng: coords.lng,
        location: coords.lat ? `GPS (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})` : 'Web Verified Location',
      });
      toast.success('🟢 Checked In successfully with GPS location!');
      fetchAttendanceStatus();
    } catch (err) {
      toast.error(err.message || 'Failed to Check In');
    } finally {
      setIsAttendanceLoading(false);
    }
  };

  const handleGPSCheckOut = async () => {
    setIsAttendanceLoading(true);
    const getCoordinates = () =>
      new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => resolve({ lat: null, lng: null })
          );
        } else {
          resolve({ lat: null, lng: null });
        }
      });

    try {
      const coords = await getCoordinates();
      const res = await attendanceService.checkOut({
        lat: coords.lat,
        lng: coords.lng,
        location: coords.lat ? `GPS (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})` : 'Web Verified Location',
      });
      toast.success(`🔴 Checked Out! Total Working Hours: ${res.data?.workingHours || 0} hrs`);
      fetchAttendanceStatus();
    } catch (err) {
      toast.error(err.message || 'Failed to Check Out');
    } finally {
      setIsAttendanceLoading(false);
    }
  };

  const handleProfileClick = () => {
    const profilePath =
      user?.role === 'client'
        ? '/client/profile'
        : user?.role === 'user'
        ? '/user/profile'
        : getRoleDashboardPath(user?.role);
    navigate(profilePath);
    setShowProfileMenu(false);
  };

  return (
    <header className="h-16 sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: Hamburger Menu & Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div className="relative max-w-xs sm:max-w-sm w-full hidden sm:block">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search clients, tasks, documents..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Center / Right section: Top Navbar Attendance GPS Widget */}
      {user && user.role !== 'SUPER_ADMIN' && user.role !== 'CLIENT' && (
        <div className="hidden md:flex items-center gap-2 mr-3 p-1 rounded-xl bg-slate-950 border border-slate-800">
          {!attendanceStatus?.isCheckedIn ? (
            <button
              disabled={isAttendanceLoading}
              onClick={handleGPSCheckIn}
              className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 transition-all"
              title="Click to Clock In with GPS Verification"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <FiMapPin className="w-3.5 h-3.5" />
              <span>Check In (GPS)</span>
            </button>
          ) : !attendanceStatus?.isCheckedOut ? (
            <div className="flex items-center gap-2 px-2">
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Working: {attendanceStatus.workingHours || 0} hrs</span>
              </div>
              <button
                disabled={isAttendanceLoading}
                onClick={handleGPSCheckOut}
                className="py-1 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-1"
                title="Click to Clock Out"
              >
                <span>Check Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-300">
              <FiCheckCircle className="text-emerald-400" />
              <span>Checked Out ({attendanceStatus.workingHours || 0} hrs)</span>
            </div>
          )}
        </div>
      )}

      {/* Right section: Dark Mode, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {isDark ? <FiSun className="w-4 h-4 text-amber-400" /> : <FiMoon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors relative"
          >
            <FiBell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Notifications
                </h4>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                  {notifications.length} New
                </span>
              </div>

              <div className="divide-y divide-slate-800/60 my-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 hover:bg-slate-800/40 px-2 rounded-lg transition-colors">
                    <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{n.desc}</p>
                    <span className="text-[10px] text-slate-500">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <Avatar firstName={user?.firstName} lastName={user?.lastName} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
              </p>
              <p className="text-[10px] font-semibold text-indigo-400">
                {formatRoleName(user?.role)}
              </p>
            </div>
            <FiChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
              <div className="p-3 border-b border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-100">{user?.email}</p>
                <span className="text-[10px] text-slate-400">{formatRoleName(user?.role)}</span>
              </div>

              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <FiUser className="w-4 h-4 text-indigo-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
