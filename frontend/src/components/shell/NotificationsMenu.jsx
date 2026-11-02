import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, CalendarDays, CheckCheck, FileText, Inbox, Megaphone, Receipt, SquareCheckBig, Video } from 'lucide-react';
import { Button, Menu } from '../ui';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '../../queries/useNotifications';
import { cn } from '../../lib/cn';
import { timeAgo } from '../../utils/timeAgo';

const ICONS = {
  NOTICE: Megaphone,
  TASK_ASSIGNED: SquareCheckBig,
  TASK_STATUS: SquareCheckBig,
  TASK_COMMENT: SquareCheckBig,
  WORK_REQUESTED: Inbox,
  WORK_REQUEST_DECIDED: Inbox,
  LEAVE_REQUESTED: CalendarDays,
  LEAVE_REVIEWED: CalendarDays,
  CLIENT_DOCUMENT: FileText,
  DOCUMENT_REQUESTED: FileText,
  DOCUMENT_REMINDER: FileText,
  INVOICE: Receipt,
  PAYMENT: Receipt,
  MEETING: Video,
};

/** The bell: real notifications, updated live; opening one marks it read and goes to its page. */
export const NotificationsMenu = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const items = data?.items || [];
  const unread = data?.unread || 0;

  return (
    <Menu
      width="w-[22rem] max-w-[calc(100vw-1.5rem)]"
      trigger={(p) => (
        <Button {...p} variant="ghost" size="icon" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} className="relative">
          <Bell className="w-[18px] h-[18px]" aria-hidden="true" />
          {unread > 0 && (
            <span
              className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-danger text-[10px] font-semibold text-white ring-2 ring-surface tabular-nums"
              aria-hidden="true"
            >
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </Button>
      )}
    >
      {(close) => (
        <>
          <div className="flex items-center justify-between px-2.5 pt-1.5 pb-2">
            <p className="text-sm font-semibold text-fg">Notifications</p>
            {unread > 0 ? (
              <button type="button" onClick={() => markAll.mutate()} className="inline-flex items-center gap-1 text-xs font-medium text-accent-fg hover:underline underline-offset-4">
                <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Mark all read
              </button>
            ) : (
              <span className="text-xs text-subtle">All caught up</span>
            )}
          </div>
          <div className="max-h-[22rem] overflow-y-auto" aria-live="polite">
            {isLoading ? (
              <div className="space-y-2 p-2.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-10 rounded-xl bg-hover animate-pulse" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <BellOff className="w-5 h-5 text-subtle" aria-hidden="true" />
                <p className="text-sm text-muted">No notifications yet.</p>
              </div>
            ) : (
              items.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                return (
                  <button
                    key={n.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      if (!n.readAt) markRead.mutate(n.id);
                      close();
                      if (n.link) navigate(n.link);
                    }}
                    className={cn(
                      'w-full flex items-start gap-3 px-2.5 py-2.5 rounded-xl text-left transition-colors hover:bg-hover focus-visible:outline-none focus-visible:bg-hover',
                      !n.readAt && 'bg-accent-soft/40'
                    )}
                  >
                    <span className={cn('grid place-items-center w-8 h-8 rounded-xl shrink-0', n.readAt ? 'bg-sunken text-subtle' : 'bg-accent-soft text-accent-fg')}>
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className={cn('block text-sm line-clamp-2', n.readAt ? 'text-muted' : 'font-medium text-fg')}>{n.title}</span>
                      {n.body && <span className="block text-xs text-muted line-clamp-1 mt-0.5">{n.body}</span>}
                      <span className="block text-xs text-subtle mt-0.5">{timeAgo(n.createdAt)}</span>
                    </span>
                    {!n.readAt && <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" aria-label="Unread" />}
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
    </Menu>
  );
};
