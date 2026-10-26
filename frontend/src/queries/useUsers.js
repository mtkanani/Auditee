import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { firmAdminService } from '../services/firmAdminService';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { assignmentService } from '../services/assignmentService';
import { userKeys, assignmentKeys, lookupKeys, dashboardKeys } from './keys';

// ----------------------------------------------------
// QUERIES
// ----------------------------------------------------

export const useFirmUsersList = (params = {}) => {
  const query = useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const res = await firmAdminService.getUsers(params);
      return res;
    },
    placeholderData: keepPreviousData,
  });

  const rawUsers = query.data?.data || query.data?.users || (Array.isArray(query.data) ? query.data : []);
  const pagination = query.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalRecords = pagination?.totalRecords || rawUsers.length;

  return {
    users: rawUsers,
    pagination,
    totalPages,
    totalRecords,
    ...query,
  };
};

export const useUserDetail = (userId) => {
  const query = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => firmAdminService.getUserById(userId),
    enabled: Boolean(userId),
  });

  return {
    user: query.data?.data || query.data?.user || query.data,
    ...query,
  };
};

export const useUserProfile = () => {
  const query = useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => userService.getProfile(),
  });

  return {
    profile: query.data?.data || query.data,
    ...query,
  };
};

export const useAllAssignments = (params = {}) => {
  const query = useQuery({
    queryKey: assignmentKeys.list(params),
    queryFn: async () => {
      const res = await assignmentService.getAllAssignments(params);
      return res.data || res.assignments || (Array.isArray(res) ? res : []);
    },
  });

  return {
    assignments: Array.isArray(query.data) ? query.data : [],
    ...query,
  };
};

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData) => firmAdminService.createUser(userData),
    onSuccess: () => {
      toast.success('Employee User created successfully!');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lookupKeys.users() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create user.');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => firmAdminService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      toast.success('User details updated successfully!');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: lookupKeys.users() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update user.');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => firmAdminService.deleteUser(id),
    onSuccess: () => {
      toast.success('Employee User deleted successfully!');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lookupKeys.users() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete user.');
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => firmAdminService.updateUserStatus(id, status),
    onSuccess: (_, { id, status }) => {
      toast.success(`User status changed to ${status}`);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: lookupKeys.users() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update status.');
    },
  });
};

export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: ({ id, newPassword }) => firmAdminService.resetUserPassword(id, newPassword),
    onSuccess: () => {
      toast.success('Password reset successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to reset password.');
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => userService.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update profile.');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ email, currentPassword, newPassword }) =>
      authService.changePassword(email, currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to change password.');
    },
  });
};

export const useAssignClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, clientId, notes }) => assignmentService.assignClient(userId, clientId, notes),
    onSuccess: () => {
      toast.success('Client assigned to employee successfully!');
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to assign client.');
    },
  });
};

export const useRemoveAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, clientId }) => assignmentService.removeAssignment(userId, clientId),
    onSuccess: () => {
      toast.success('Assignment removed!');
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to remove assignment.');
    },
  });
};
