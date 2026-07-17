import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, KeyRound, LogOut, X, Trash2, Users, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: 'User Profile',
      path: '/profile',
      icon: User,
    },
    {
      name: 'Change Password',
      path: '/change-password',
      icon: KeyRound,
    },
    {
      name: 'Delete Account',
      path: '/delete-account',
      icon: Trash2,
    },
  ];

  // Dynamically inject Admin-only links
  const role = user?.role?.toLowerCase();
  if (role === 'admin' || role === 'super_admin') {
    menuItems.splice(1, 0, {
      name: 'Manage Users',
      path: '/admin/users',
      icon: Users,
    });
    menuItems.splice(2, 0, {
      name: 'Manage Firms',
      path: '/admin/firms',
      icon: Building2,
    });
  }

  return (
    <>
      {/* Mobile Sidebar Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 laptop:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-md
          flex flex-col transform transition-transform duration-300 ease-in-out
          laptop:translate-x-0 laptop:static laptop:h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center">
            <img src="/auditee logo.svg" alt="Auditee Logo" className="h-7 w-auto object-contain" />
          </div>

          {/* Close button on mobile */}
          <button 
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-slate-200 laptop:hidden focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Mini Profile */}
        {user && (
          <div className="px-6 py-5 border-b border-slate-800/50 bg-slate-900/10">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Logged in as</p>
            <p className="text-sm font-semibold text-slate-200 mt-1 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{user.email}</p>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Close sidebar on mobile select
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' 
                    : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200 border border-transparent'}
                `}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout area */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={() => {
              logout();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border border-transparent"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
