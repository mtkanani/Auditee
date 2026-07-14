import React from 'react';
import { Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ toggleSidebar, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button for Mobile/Tablet */}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 laptop:hidden focus:outline-none"
        >
          <Menu size={20} />
        </button>
        
        {/* Page Title */}
        <h2 className="text-lg font-bold font-sans text-white tracking-tight">
          {title}
        </h2>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            {/* User Avatar Circle */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-brand-500 flex items-center justify-center text-white font-bold text-sm shadow-glow-indigo/20">
              {user.firstName ? user.firstName[0].toUpperCase() : <User size={16} />}
            </div>
            
            {/* User Info Label (Hidden on mobile) */}
            <div className="hidden mobile:block text-left">
              <p className="text-sm font-semibold text-slate-200 leading-none">
                {user.firstName} {user.lastName}
              </p>
              <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider mt-0.5 inline-block bg-brand-500/10 px-1.5 py-0.5 rounded-md border border-brand-500/20">
                {user.role || 'User'}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
