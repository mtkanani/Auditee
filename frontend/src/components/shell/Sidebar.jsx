import React from 'react';
import { NavLink } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getNavGroups } from '../../layouts/navigation';
import { formatRoleName } from '../../utils/helpers';
import { Avatar } from '../common/Avatar';
import { cn } from '../../lib/cn';

const NavItem = ({ item, collapsed, onNavigate }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 h-9 rounded-xl text-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
          collapsed ? 'justify-center px-0' : 'px-3',
          isActive ? 'bg-accent-soft text-fg font-medium' : 'text-muted hover:text-fg hover:bg-hover'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-accent to-accent-2" aria-hidden="true" />
          )}
          <Icon className={cn('w-[18px] h-[18px] shrink-0', isActive ? 'text-accent-fg' : 'text-subtle group-hover:text-muted')} aria-hidden="true" />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
};

/**
 * App sidebar. Desktop: fixed, expanded (256px) or collapsed to icons (72px).
 * Below lg: an off-canvas drawer controlled by mobileOpen.
 */
export const Sidebar = ({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }) => {
  const { user } = useAuth();
  const groups = getNavGroups(user?.role);
  // The drawer always shows labels, even when the desktop sidebar is collapsed.
  const compact = collapsed && !mobileOpen;

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm lg:hidden" onClick={onMobileClose} aria-hidden="true" />
      )}

      <aside
        aria-label="Main navigation"
        className={cn(
          // Above the floating copilot button while open on mobile; normal layer on desktop.
          'fixed inset-y-0 left-0 z-[56] lg:z-50 flex flex-col bg-surface border-r border-line',
          'transition-[width,transform] duration-300 ease-out',
          'w-72 lg:translate-x-0',
          compact ? 'lg:w-[72px]' : 'lg:w-64',
          mobileOpen ? 'translate-x-0 shadow-raised' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className={cn('h-16 flex items-center border-b border-line shrink-0', compact ? 'justify-center px-0' : 'justify-between px-5')}>
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-2 text-on-accent font-bold shadow-glow shrink-0">
              A
            </span>
            {!compact && (
              <div className="min-w-0">
                <p className="font-semibold text-fg leading-tight">Auditee</p>
                <p className="text-xs text-subtle leading-tight">Practice suite</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close menu"
            className="lg:hidden grid place-items-center w-8 h-8 rounded-lg text-muted hover:text-fg hover:bg-hover"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Groups */}
        <nav className={cn('flex-1 overflow-y-auto py-4 space-y-5', compact ? 'px-3' : 'px-3')}>
          {groups.map((group) => (
            <div key={group.label}>
              {compact ? (
                <div className="mx-2 mb-2 h-px bg-line" aria-hidden="true" />
              ) : (
                <p className="px-3 mb-1.5 text-xs font-medium text-subtle">{group.label}</p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={item.path} item={item} collapsed={compact} onNavigate={onMobileClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer: who's signed in + collapse toggle */}
        <div className={cn('border-t border-line p-3 shrink-0', compact ? 'space-y-2' : 'flex items-center gap-2')}>
          <div className={cn('flex items-center gap-3 min-w-0', compact ? 'justify-center' : 'flex-1 px-1')}>
            <Avatar firstName={user?.firstName} lastName={user?.lastName} size="sm" />
            {!compact && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Signed in'}
                </p>
                <p className="text-xs text-subtle truncate">{formatRoleName(user?.role)}</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'hidden lg:grid place-items-center w-8 h-8 rounded-lg text-subtle hover:text-fg hover:bg-hover shrink-0',
              compact && 'mx-auto'
            )}
          >
            {collapsed ? <PanelLeftOpen className="w-[18px] h-[18px]" aria-hidden="true" /> : <PanelLeftClose className="w-[18px] h-[18px]" aria-hidden="true" />}
          </button>
        </div>
      </aside>
    </>
  );
};
