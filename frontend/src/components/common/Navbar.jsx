import React, { useState } from 'react';
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
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from './Avatar';
import { formatRoleName } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout, getRoleDashboardPath } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Sample system notifications
  const [notifications] = useState([
    { id: 1, title: 'New Work Request', desc: 'ABC Pvt Ltd submitted GST filing request', time: '5m ago' },
    { id: 2, title: 'Task Completed', desc: 'Amit completed Income Tax Audit Report', time: '1h ago' },
    { id: 3, title: 'Compliance Reminder', desc: 'Quarterly TDS Return due in 3 days', time: '3h ago' },
  ]);

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
