import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';
import { clientService } from '../services/clientService';
import { taskKeys, dashboardKeys } from './keys';

// ----------------------------------------------------
// QUERIES
// ----------------------------------------------------

export const useFirmTasks = (filters = {}) => {
  const query = useQuery({
    queryKey: taskKeys.list('firm', filters),
    queryFn: () => taskService.getAllTasks(filters),
    placeholderData: keepPreviousData,
  });

  return {
    tasks: query.data?.data ?? (Array.isArray(query.data) ? query.data : []),
    pagination: query.data?.pagination,
    ...query,
  };
};

export const useMyTasks = (filters = {}) => {
  const query = useQuery({
    queryKey: taskKeys.list('user', filters),
    queryFn: () => userService.getTasks(filters),
  });

  return {
    tasks: query.data?.data ?? query.data?.tasks ?? (Array.isArray(query.data) ? query.data : []),
    pagination: query.data?.pagination,
    ...query,
  };
};

export const useClientTasks = () => {
  const query = useQuery({
    queryKey: taskKeys.list('client', {}),
    queryFn: () => clientService.getTasks(),
  });

  return {
    tasks: query.data?.data ?? query.data?.tasks ?? (Array.isArray(query.data) ? query.data : []),
    ...query,
  };
};

export const useClientRequests = () => {
  const query = useQuery({
    queryKey: taskKeys.clientRequests(),
    queryFn: () => taskService.getClientRequests(),
  });

  return {
    requests: query.data?.data ?? (Array.isArray(query.data) ? query.data : []),
    ...query,
  };
};

export const useTaskDetail = (taskId, { enabled = true } = {}) => {
  const query = useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => taskService.getTaskById(taskId),
    enabled: Boolean(taskId && enabled),
  });

  return {
    task: query.data?.data ?? query.data,
    ...query,
  };
};

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskData) => taskService.createTask(taskData),
    onSuccess: () => {
      toast.success('Task created and assigned successfully!');
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create task');
    },
  });
};

export const useClientCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskData) => clientService.createTask(taskData),
    onSuccess: () => {
      toast.success('Work request submitted successfully to your CA firm!');
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit work request.');
    },
  });
};

export const useUpdateTaskStatus = ({ scope } = {}) => {
  const queryClient = useQueryClient();
  const updateFn = scope === 'user' ? userService.updateTaskStatus : taskService.updateTaskStatus;

  return useMutation({
    mutationFn: ({ taskId, status }) => updateFn(taskId, status),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      await queryClient.cancelQueries({ queryKey: dashboardKeys.all });

      const previousListQueries = queryClient.getQueriesData({ queryKey: taskKeys.lists() });
      const previousDashboardQueries = queryClient.getQueriesData({ queryKey: dashboardKeys.all });

      // Optimistically update list caches
      queryClient.setQueriesData({ queryKey: taskKeys.lists() }, (old) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((t) => (t.id === taskId ? { ...t, status } : t));
        }
        if (Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((t) => (t.id === taskId ? { ...t, status } : t)),
          };
        }
        if (Array.isArray(old.tasks)) {
          return {
            ...old,
            tasks: old.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
          };
        }
        return old;
      });

      // Optimistically update dashboard queries
      queryClient.setQueriesData({ queryKey: dashboardKeys.all }, (old) => {
        if (!old) return old;
        const updateTaskArray = (arr) => arr.map((t) => (t.id === taskId ? { ...t, status } : t));
        if (Array.isArray(old.tasks)) {
          return { ...old, tasks: updateTaskArray(old.tasks) };
        }
        if (old.data && Array.isArray(old.data.tasks)) {
          return { ...old, data: { ...old.data, tasks: updateTaskArray(old.data.tasks) } };
        }
        return old;
      });

      return { previousListQueries, previousDashboardQueries, taskId, status };
    },
    onError: (err, variables, context) => {
      if (context?.previousListQueries) {
        context.previousListQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDashboardQueries) {
        context.previousDashboardQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err?.message || 'Failed to update task status');
    },
    onSuccess: (data, variables) => {
      toast.success(
        scope === 'user'
          ? 'Task status updated!'
          : `Task status updated to ${variables.status}`
      );
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      if (variables?.taskId) {
        queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      }
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
};

export const useApproveClientRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, approvalData }) => taskService.approveClientRequest(taskId, approvalData),
    onSuccess: () => {
      toast.success('Client Work Request approved and assigned!');
      queryClient.invalidateQueries({ queryKey: taskKeys.clientRequests() });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to approve request');
    },
  });
};

export const useRejectClientRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId) => taskService.rejectClientRequest(taskId),
    onSuccess: () => {
      toast.success('Client Work Request rejected');
      queryClient.invalidateQueries({ queryKey: taskKeys.clientRequests() });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to reject client request');
    },
  });
};

export const useAddSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, title }) => taskService.addSubtask(taskId, title),
    onSuccess: (data, variables) => {
      toast.success('Subtask added to checklist');
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to add subtask');
    },
  });
};

export const useToggleSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, subtaskId, isCompleted }) =>
      taskService.toggleSubtask(taskId, subtaskId, isCompleted),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update subtask');
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, commentData }) => taskService.addComment(taskId, commentData),
    onSuccess: (data, variables) => {
      toast.success('Comment posted');
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to post comment');
    },
  });
};

export const useAddDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, docData }) => taskService.addDocument(taskId, docData),
    onSuccess: (data, variables) => {
      toast.success('Attachment added');
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to attach document');
    },
  });
};
