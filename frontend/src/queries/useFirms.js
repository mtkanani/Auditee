import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { superAdminService } from '../services/superAdminService';
import { firmAdminService } from '../services/firmAdminService';
import { firmKeys, dashboardKeys } from './keys';

// ----------------------------------------------------
// QUERIES
// ----------------------------------------------------

export const useFirmsList = (params = {}) => {
  const query = useQuery({
    queryKey: firmKeys.list(params),
    queryFn: async () => {
      const res = await superAdminService.getAllFirms(params);
      return res;
    },
    placeholderData: keepPreviousData,
  });

  const rawFirms = query.data?.data || query.data?.firms || (Array.isArray(query.data) ? query.data : []);
  const pagination = query.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalRecords = pagination?.totalRecords || rawFirms.length;

  return {
    firms: rawFirms,
    pagination,
    totalPages,
    totalRecords,
    ...query,
  };
};

export const useFirmDetail = (id) => {
  const query = useQuery({
    queryKey: firmKeys.detail(id),
    queryFn: () => superAdminService.getFirmById(id),
    enabled: Boolean(id),
  });

  return {
    firm: query.data?.data || query.data?.firm || query.data,
    ...query,
  };
};

export const useFirmAdminDashboard = () => {
  const query = useQuery({
    queryKey: dashboardKeys.byRole('firm-admin'),
    queryFn: async () => {
      const res = await firmAdminService.getDashboard();
      return res.data || res;
    },
  });

  return {
    dashboard: query.data,
    ...query,
  };
};

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

export const useCreateFirm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ firm, firmAdmin }) => superAdminService.createFirm({ firm, firmAdmin }),
    onSuccess: () => {
      toast.success('CA Firm created successfully!');
      queryClient.invalidateQueries({ queryKey: firmKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to create firm.');
    },
  });
};

export const useUpdateFirm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => superAdminService.updateFirm(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Firm updated successfully!');
      queryClient.invalidateQueries({ queryKey: firmKeys.lists() });
      queryClient.invalidateQueries({ queryKey: firmKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update firm.');
    },
  });
};

export const useDeleteFirm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => superAdminService.deleteFirm(id),
    onSuccess: () => {
      toast.success('Firm deleted successfully!');
      queryClient.invalidateQueries({ queryKey: firmKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete firm.');
    },
  });
};

export const useUpdateFirmStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => superAdminService.updateFirmStatus(id, status),
    onSuccess: (_, { id, status }) => {
      toast.success(`Firm status updated to ${status}`);
      queryClient.invalidateQueries({ queryKey: firmKeys.lists() });
      queryClient.invalidateQueries({ queryKey: firmKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update status.');
    },
  });
};

export const useResetFirmAdminPassword = () => {
  return useMutation({
    mutationFn: ({ id, newPassword }) => superAdminService.resetFirmAdminPassword(id, newPassword),
    onSuccess: () => {
      toast.success('Firm Admin password reset successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to reset password.');
    },
  });
};
