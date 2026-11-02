import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { connectRealtime, disconnectRealtime } from '../../lib/realtime';
import {
  announcementKeys,
  assignmentKeys,
  attendanceKeys,
  clientKeys,
  complianceKeys,
  dashboardKeys,
  documentKeys,
  documentRequestKeys,
  firmKeys,
  invoiceKeys,
  leadKeys,
  leaveKeys,
  meetingKeys,
  notificationKeys,
  reportKeys,
  taskKeys,
  userKeys,
} from '../../queries/keys';

// Server module name (see Backend/src/realtime/changeFeed.js) -> the query families to refetch.
const MODULE_KEYS = {
  tasks: [taskKeys.all],
  compliance: [complianceKeys.all],
  leads: [leadKeys.all],
  invoices: [invoiceKeys.all],
  announcements: [announcementKeys.all],
  attendance: [attendanceKeys.all],
  leave: [leaveKeys.all],
  documents: [documentKeys.all, documentRequestKeys.all],
  meetings: [meetingKeys.all],
  assignments: [assignmentKeys.all],
  clients: [clientKeys.all, ['lookup', 'clients']],
  users: [userKeys.all, ['lookup', 'users']],
  firms: [firmKeys.all],
  dashboard: [dashboardKeys.all],
  reports: [reportKeys.all],
};

const NotificationToast = ({ t, n, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className={`flex items-start gap-3 w-[340px] max-w-[calc(100vw-2rem)] p-3.5 rounded-2xl bg-surface border border-line shadow-raised text-left transition-opacity ${t.visible ? 'opacity-100' : 'opacity-0'}`}
  >
    <span className="grid place-items-center w-8 h-8 rounded-xl bg-accent-soft text-accent-fg shrink-0">
      <Bell className="w-4 h-4" aria-hidden="true" />
    </span>
    <span className="min-w-0">
      <span className="block text-sm font-medium text-fg line-clamp-2">{n.title}</span>
      {n.body && <span className="block text-xs text-muted line-clamp-2 mt-0.5">{n.body}</span>}
    </span>
  </button>
);

/**
 * Keeps every open screen current without a refresh. When anyone in the firm changes something, the
 * server says which kinds of data changed and only those queries refetch. New notifications land in
 * the bell straight away with a small toast. After a dropped connection everything on screen
 * refetches once, so nothing missed while offline stays stale.
 */
export const RealtimeBridge = () => {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = accessToken || localStorage.getItem('accessToken');
  const userId = user?.id;

  useEffect(() => {
    if (!userId || !token) return undefined;
    let cancelled = false;

    connectRealtime(token).then((socket) => {
      if (cancelled || !socket) return;
      let connectedBefore = false;

      socket.on('connect', () => {
        if (connectedBefore) queryClient.invalidateQueries();
        connectedBefore = true;
      });

      socket.on('data:changed', ({ modules = [] } = {}) => {
        const seen = new Set();
        for (const m of modules) {
          for (const queryKey of MODULE_KEYS[m] || []) {
            const id = queryKey.join('/');
            if (seen.has(id)) continue;
            seen.add(id);
            queryClient.invalidateQueries({ queryKey });
          }
        }
      });

      socket.on('notification:new', (n) => {
        const list = notificationKeys.list();
        if (queryClient.getQueryData(list)) {
          queryClient.setQueryData(list, (old) => ({
            items: [n, ...old.items.filter((x) => x.id !== n.id)].slice(0, 20),
            unread: old.unread + 1,
          }));
        } else {
          queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        }
        toast.custom(
          (t) => (
            <NotificationToast
              t={t}
              n={n}
              onOpen={() => {
                toast.dismiss(t.id);
                if (n.link) navigate(n.link);
              }}
            />
          ),
          { id: `notification-${n.id}`, duration: 6000, position: 'top-right' }
        );
      });
    });

    return () => {
      cancelled = true;
      disconnectRealtime();
    };
  }, [userId, token, queryClient, navigate]);

  return null;
};
