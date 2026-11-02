import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { notificationKeys } from './keys';

/** The bell: latest 20 and the unread count. New ones arrive over the socket (see RealtimeBridge). */
export const useNotifications = () =>
  useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationService.list(20),
    staleTime: 60_000,
  });

const markLocally = (queryClient, id) =>
  queryClient.setQueryData(notificationKeys.list(), (old) => {
    if (!old) return old;
    const now = new Date().toISOString();
    let changed = 0;
    const items = old.items.map((n) => {
      if (n.readAt || (id !== undefined && n.id !== id)) return n;
      changed += 1;
      return { ...n, readAt: now };
    });
    return { items, unread: id === undefined ? 0 : Math.max(0, old.unread - changed) };
  });

// Both update the bell straight away and confirm with the server after.
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationService.markRead(id),
    onMutate: (id) => markLocally(queryClient, id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onMutate: () => markLocally(queryClient, undefined),
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};
