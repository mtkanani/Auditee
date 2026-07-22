import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiUserCheck,
  FiCheckSquare,
  FiFileText,
  FiClock,
  FiSettings,
  FiLayers,
  FiShield,
  FiLogOut,
  FiFolder,
  FiUser,
  FiX,
  FiRadio,
  FiBell,
  FiTrendingUp,
  FiDollarSign,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { formatRoleName, normalizeRole } from '../../utils/helpers';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const role = normalizeRole(user?.role);

  // Define Navigation per Role
  const getNavLinks = () => {
    switch (role) {
      case 'SUPER_ADMIN':
        return [
          { path: '/super-admin/dashboard', name: 'Overview', icon: FiGrid },
          { path: '/super-admin/firms', name: 'Firm Management', icon: FiLayers },
        ];
      case 'FIRM_ADMIN':
        return [
          { path: '/firm-admin/dashboard', name: 'Dashboard', icon: FiGrid },
          { path: '/firm-admin/billing', name: 'Billing & Invoices', icon: FiDollarSign },
          { path: '/firm-admin/leads', name: 'Lead CRM', icon: FiTrendingUp },
          { path: '/firm-admin/tasks', name: 'Task Workstation', icon: FiCheckSquare },
          { path: '/firm-admin/users', name: 'User Management', icon: FiUsers },
          { path: '/firm-admin/clients', name: 'Client Management', icon: FiBriefcase },
          { path: '/firm-admin/assignments', name: 'Client Assignment', icon: FiUserCheck },
          { path: '/firm-admin/announcements', name: 'Notice Board', icon: FiRadio },
          { path: '/firm-admin/compliance', name: 'Compliance', icon: FiShield },
          { path: '/firm-admin/reports', name: 'Reports', icon: FiFileText },
        ];
      case 'CLIENT':
        return [
          { path: '/client/dashboard', name: 'Dashboard', icon: FiGrid },
          { path: '/client/work-requests', name: 'Work Requests', icon: FiFileText },
          { path: '/client/tasks', name: 'My Tasks', icon: FiCheckSquare },
          { path: '/client/profile', name: 'Profile & Settings', icon: FiUser },
        ];
      case 'USER':
      default:
        return [
          { path: '/user/dashboard', name: 'Dashboard', icon: FiGrid },
          { path: '/user/announcements', name: 'Firm Notices', icon: FiBell },
          { path: '/user/tasks', name: 'My Tasks', icon: FiCheckSquare },
          { path: '/user/clients', name: 'My Clients', icon: FiBriefcase },
          { path: '/user/time-entries', name: 'Time Entries', icon: FiClock },
          { path: '/user/profile', name: 'Profile & Settings', icon: FiUser },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900/95 dark:bg-slate-900 border-r border-slate-800 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
                A
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-slate-100 tracking-tight leading-none">
                  AUDITEE
                </h1>
                <span className="text-[10px] font-semibold text-indigo-400 tracking-wider">
                  CA FIRM SAAS
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Badge Card */}
          <div className="p-4 mx-3 my-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="text-xs font-bold text-indigo-400">
                {formatRoleName(user?.role)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-1">
              {user?.email || 'Logged in user'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-250px)]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
