import axiosInstance from './axiosInstance';

const getBaseUrl = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const role = (JSON.parse(userStr)?.role || '').toUpperCase();
      if (role === 'CLIENT') return '/client/tasks';
      if (role === 'USER' || role === 'EMPLOYEE') return '/user/tasks';
    }
  } catch (e) {}
  return '/firm-admin/tasks';
};

export const taskService = {
  // Tasks APIs
  createTask: async (taskData) => {
    const res = await axiosInstance.post(getBaseUrl(), taskData);
    return res.data;
  },

  getAllTasks: async (params = {}) => {
    const res = await axiosInstance.get(getBaseUrl(), { params });
    return res.data;
  },

  getTaskById: async (taskId) => {
    const res = await axiosInstance.get(`${getBaseUrl()}/${taskId}`);
    return res.data;
  },

  updateTaskStatus: async (taskId, status) => {
    const res = await axiosInstance.patch(`${getBaseUrl()}/${taskId}/status`, { status });
    return res.data;
  },

  getClientRequests: async () => {
    const res = await axiosInstance.get(`${getBaseUrl()}/client-requests`);
    return res.data;
  },

  approveClientRequest: async (taskId, approvalData) => {
    const res = await axiosInstance.patch(`${getBaseUrl()}/${taskId}/approve-request`, approvalData);
    return res.data;
  },

  rejectClientRequest: async (taskId) => {
    const res = await axiosInstance.patch(`${getBaseUrl()}/${taskId}/reject-request`);
    return res.data;
  },

  // Subtasks
  addSubtask: async (taskId, title) => {
    const res = await axiosInstance.post(`${getBaseUrl()}/${taskId}/subtasks`, { title });
    return res.data;
  },

  toggleSubtask: async (taskId, subtaskId, isCompleted) => {
    const res = await axiosInstance.patch(`${getBaseUrl()}/${taskId}/subtasks/${subtaskId}`, { isCompleted });
    return res.data;
  },

  // Comments
  addComment: async (taskId, commentData) => {
    const res = await axiosInstance.post(`${getBaseUrl()}/${taskId}/comments`, commentData);
    return res.data;
  },

  // Documents
  addDocument: async (taskId, docData) => {
    const res = await axiosInstance.post(`${getBaseUrl()}/${taskId}/documents`, docData);
    return res.data;
  },

  // Audit Templates
  getTemplates: async () => {
    const res = await axiosInstance.get(`${getBaseUrl()}/templates`);
    return res.data;
  },

  createTemplate: async (templateData) => {
    const res = await axiosInstance.post(`${getBaseUrl()}/templates`, templateData);
    return res.data;
  },

  // Dependencies
  addDependency: async (taskId, dependsOnTaskId) => {
    const res = await axiosInstance.post(`${getBaseUrl()}/${taskId}/dependencies`, { dependsOnTaskId });
    return res.data;
  },
};
