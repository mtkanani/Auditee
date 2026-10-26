import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '../services/announcementService';
import { announcementKeys, dashboardKeys } from './keys';
import toast from 'react-hot-toast';

// ----------------------------------------------------
// QUERIES
// ----------------------------------------------------

export const useAdminAnnouncements = () => {
  const query = useQuery({
    queryKey: announcementKeys.admin(),
    queryFn: () => announcementService.getAdminNotices(),
  });

  return {
    notices: query.data?.data || query.data || [],
    ...query,
  };
};

export const useUserAnnouncements = () => {
  const query = useQuery({
    queryKey: announcementKeys.user(),
    queryFn: () => announcementService.getUserNotices(),
  });

  return {
    notices: query.data?.data || query.data || [],
    ...query,
  };
};

export const useNoticeAnalytics = (noticeId, { enabled = true } = {}) => {
  const query = useQuery({
    queryKey: announcementKeys.analytics(noticeId),
    queryFn: () => announcementService.getNoticeAnalytics(noticeId),
    enabled: Boolean(noticeId && enabled),
  });

  return {
    analytics: query.data?.data || query.data,
    ...query,
  };
};

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noticeData) => announcementService.createNotice(noticeData),
    onSuccess: () => {
      toast.success('Notice broadcast created successfully!');
      queryClient.invalidateQueries({ queryKey: announcementKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create notice');
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => announcementService.deleteNotice(id),
    onSuccess: () => {
      toast.success('Notice deleted!');
      queryClient.invalidateQueries({ queryKey: announcementKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete notice');
    },
  });
};

export const useAcknowledgeNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => announcementService.acknowledgeNotice(id),
    onSuccess: () => {
      toast.success('Notice acknowledged successfully!');
      queryClient.invalidateQueries({ queryKey: announcementKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to acknowledge notice');
    },
  });
};
