import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { leaveService } from '../services/leaveService';
import { leaveKeys, dashboardKeys } from './keys';
import { queryClient } from '../lib/queryClient';
import toast from 'react-hot-toast';

export const useMyLeaveData = (options = {}) => {
  return useQuery({
    queryKey: leaveKeys.my(),
    queryFn: async () => {
      const res = await leaveService.getMyLeaveData();
      return res.data || res || { balance: null, requests: [], policy: null };
    },
    ...options,
  });
};

export const usePendingLeaveRequests = (options = {}) => {
  return useQuery({
    queryKey: leaveKeys.pending(),
    queryFn: async () => {
      const res = await leaveService.getPendingRequests();
      return res.data || res || { pendingRequests: [], count: 0 };
    },
    ...options,
  });
};

export const useAllFirmLeaveRequests = (options = {}) => {
  return useQuery({
    queryKey: leaveKeys.firmRequests(),
    queryFn: async () => {
      const res = await leaveService.getAllFirmRequests();
      return res.data || res || [];
    },
    ...options,
  });
};

export const useLeaveCalendar = (params = {}, options = {}) => {
  return useQuery({
    queryKey: leaveKeys.calendar(params),
    queryFn: async () => {
      const res = await leaveService.getLeaveCalendar(params);
      return res.data || res || [];
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useLeavePolicy = (options = {}) => {
  return useQuery({
    queryKey: leaveKeys.policy(),
    queryFn: async () => {
      const res = await leaveService.getLeavePolicy();
      return res.data || res || null;
    },
    ...options,
  });
};

export const useAllEmployeeBalances = (options = {}) => {
  return useQuery({
    queryKey: leaveKeys.balances(),
    queryFn: async () => {
      const res = await leaveService.getAllEmployeeBalances();
      return res.data || res || [];
    },
    ...options,
  });
};

export const useApplyLeave = () => {
  return useMutation({
    mutationFn: (data) => leaveService.applyLeave(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit leave application');
    },
  });
};

export const useReviewLeave = () => {
  return useMutation({
    mutationFn: ({ id, status, adminRemarks }) =>
      leaveService.reviewLeave(id, status, adminRemarks),
    onSuccess: (_data, variables) => {
      toast.success(`Leave request ${variables.status.toLowerCase()}!`);
      queryClient.invalidateQueries({ queryKey: leaveKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err, variables) => {
      toast.error(err.message || `Failed to ${variables.status?.toLowerCase() || 'review'} leave`);
    },
  });
};

export const useUpdateLeavePolicy = () => {
  return useMutation({
    mutationFn: (policyData) => leaveService.updateLeavePolicy(policyData),
    onSuccess: () => {
      toast.success('Firm leave policy & custom quotas updated successfully!');
      queryClient.invalidateQueries({ queryKey: leaveKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update leave policy');
    },
  });
};

export const useUpdateEmployeeLeaveBalance = () => {
  return useMutation({
    mutationFn: ({ userId, balanceData }) =>
      leaveService.updateEmployeeLeaveBalance(userId, balanceData),
    onSuccess: () => {
      toast.success('Employee custom leave quota adjusted successfully!');
      queryClient.invalidateQueries({ queryKey: leaveKeys.balances() });
      queryClient.invalidateQueries({ queryKey: leaveKeys.my() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to adjust employee leave quota');
    },
  });
};
