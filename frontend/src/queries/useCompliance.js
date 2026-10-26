import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { complianceService } from '../services/complianceService';
import { complianceKeys, taskKeys, dashboardKeys } from './keys';
import { queryClient } from '../lib/queryClient';
import toast from 'react-hot-toast';

export const useComplianceItems = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: complianceKeys.list(filters),
    queryFn: async () => {
      const res = await complianceService.getAllComplianceItems(filters);
      return res.data || res || [];
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGenerateIndianPresets = () => {
  return useMutation({
    mutationFn: ({ year, month }) => complianceService.generateIndianPresets(year, month),
    onSuccess: (_data, variables) => {
      toast.success(`Indian Statutory Calendar generated for Month ${variables.month}/${variables.year}!`);
      queryClient.invalidateQueries({ queryKey: complianceKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to generate statutory presets');
    },
  });
};

export const useUpdateComplianceStatus = () => {
  return useMutation({
    mutationFn: ({ id, status }) => complianceService.updateComplianceStatus(id, status),
    onSuccess: (_data, variables) => {
      toast.success(`Status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: complianceKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update status');
    },
  });
};

export const useConvertComplianceToTask = () => {
  return useMutation({
    mutationFn: ({ id, taskOptions }) => complianceService.convertToTask(id, taskOptions),
    onSuccess: () => {
      toast.success('Compliance item converted to an active Task!');
      queryClient.invalidateQueries({ queryKey: complianceKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to convert to task');
    },
  });
};

export const useSendComplianceReminder = () => {
  return useMutation({
    mutationFn: (id) => complianceService.sendReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to broadcast reminder');
    },
  });
};

export const useCreateComplianceItem = () => {
  return useMutation({
    mutationFn: (data) => complianceService.createComplianceItem(data),
    onSuccess: () => {
      toast.success('Custom compliance item added!');
      queryClient.invalidateQueries({ queryKey: complianceKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to add item');
    },
  });
};
