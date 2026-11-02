import React from 'react';
import { Menu as MenuIcon, Moon, Search, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { normalizeRole } from '../../utils/helpers';
import { Button } from '../ui';
import { AttendanceControl } from './AttendanceControl';
import { NewMenu, NotificationsMenu, ProfileMenu } from './TopBarMenus';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

/** Sticky top bar: menu button (mobile), search trigger, attendance, + New, theme, notifications, account. */
export const TopBar = ({ onMenuClick, onSearchClick }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const role = normalizeRole(user?.role);
  const isStaff = role === 'FIRM_ADMIN' || role === 'USER';

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 bg-page/80 backdrop-blur-xl border-b border-line">
      <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label="Open menu" className="lg:hidden -ml-1 shrink-0">
        <MenuIcon className="w-5 h-5" aria-hidden="true" />
      </Button>

      {/* Search trigger: opens the command palette. Icon-only on phones. */}
      <button
        type="button"
        onClick={onSearchClick}
        aria-label="Search or jump to"
        className="group flex items-center justify-center sm:justify-start gap-2.5 h-9 w-9 sm:w-auto sm:flex-1 sm:max-w-sm px-0 sm:px-3 shrink-0 sm:shrink rounded-xl bg-sunken border border-line text-sm text-subtle hover:border-line-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <Search className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:block flex-1 text-left truncate">Search or jump to…</span>
        <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 rounded-md border border-line bg-surface text-[11px] font-medium text-muted">
          {isMac ? '⌘' : 'Ctrl'} K
        </kbd>
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
        {isStaff && (
          <div className="hidden md:block mr-1">
            <AttendanceControl />
          </div>
        )}
        <NewMenu />
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'} className="hidden sm:inline-flex">
          {isDark ? <Sun className="w-[18px] h-[18px]" aria-hidden="true" /> : <Moon className="w-[18px] h-[18px]" aria-hidden="true" />}
        </Button>
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  );
};
