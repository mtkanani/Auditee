import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Moon, Plus, Sun, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getCreateActions, getProfilePath } from '../../layouts/navigation';
import { formatRoleName } from '../../utils/helpers';
import { Avatar } from '../common/Avatar';
import { Button, Menu, MenuDivider, MenuItem, MenuLabel } from '../ui';

/** "+ New" quick-create menu; hidden for roles without create actions. */
export const NewMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const actions = getCreateActions(user?.role);
  if (actions.length === 0) return null;

  return (
    <Menu
      width="w-52"
      trigger={(p) => (
        <Button {...p} variant="primary" size="sm" icon={Plus} className="h-9 px-3.5">
          <span className="hidden sm:inline">New</span>
        </Button>
      )}
    >
      {(close) => (
        <>
          <MenuLabel>Create</MenuLabel>
          {actions.map((a) => (
            <MenuItem
              key={a.label}
              icon={a.icon}
              onClick={() => {
                close();
                navigate(a.path, { state: a.state || { openCreate: true } });
              }}
            >
              {a.label}
            </MenuItem>
          ))}
        </>
      )}
    </Menu>
  );
};

export { NotificationsMenu } from './NotificationsMenu';

export const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const name = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User';

  return (
    <Menu
      width="w-60"
      trigger={(p) => (
        <button
          {...p}
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-xl hover:bg-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <Avatar firstName={user?.firstName} lastName={user?.lastName} size="sm" />
          <span className="hidden md:block text-sm font-medium text-fg max-w-[120px] truncate">{name}</span>
          <ChevronDown className="w-4 h-4 text-subtle" aria-hidden="true" />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="px-2.5 py-2">
            <p className="text-sm font-medium text-fg truncate">{name}</p>
            <p className="text-xs text-subtle truncate">{user?.email}</p>
            <p className="text-xs text-accent-fg mt-0.5">{formatRoleName(user?.role)}</p>
          </div>
          <MenuDivider />
          <MenuItem icon={User} onClick={() => { close(); navigate(getProfilePath(user?.role)); }}>
            Your profile
          </MenuItem>
          <MenuItem icon={isDark ? Sun : Moon} onClick={toggleTheme} hint={isDark ? 'Dark' : 'Light'}>
            {isDark ? 'Light theme' : 'Dark theme'}
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={LogOut} tone="danger" onClick={logout}>
            Sign out
          </MenuItem>
        </>
      )}
    </Menu>
  );
};
