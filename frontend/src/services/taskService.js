import axiosInstance from './axiosInstance';

export const taskService = {
  // Tasks APIs
  createTask: async (taskData) => {
    const res = await axiosInstance.post('/firm-admin/tasks', taskData);
    return res.data;
  },

  getAllTasks: async (params = {}) => {
    const res = await axiosInstance.get('/firm-admin/tasks', { params });
    return res.data;
  },

  getTaskById: async (taskId) => {
    const res = await axiosInstance.get(`/firm-admin/tasks/${taskId}`);
    return res.data;
  },

  updateTaskStatus: async (taskId, status) => {
    const res = await axiosInstance.patch(`/firm-admin/tasks/${taskId}/status`, { status });
    return res.data;
  },

  getClientRequests: async () => {
    const res = await axiosInstance.get('/firm-admin/tasks/client-requests');
    return res.data;
  },

  approveClientRequest: async (taskId, approvalData) => {
    const res = await axiosInstance.patch(`/firm-admin/tasks/${taskId}/approve-request`, approvalData);
    return res.data;
  },

  // Subtasks
  addSubtask: async (taskId, title) => {
    const res = await axiosInstance.post(`/firm-admin/tasks/${taskId}/subtasks`, { title });
    return res.data;
  },

  toggleSubtask: async (taskId, subtaskId, isCompleted) => {
    const res = await axiosInstance.patch(`/firm-admin/tasks/${taskId}/subtasks/${subtaskId}`, { isCompleted });
    return res.data;
  },

  // Comments
  addComment: async (taskId, commentData) => {
    const res = await axiosInstance.post(`/firm-admin/tasks/${taskId}/comments`, commentData);
    return res.data;
  },

  // Documents
  addDocument: async (taskId, docData) => {
    const res = await axiosInstance.post(`/firm-admin/tasks/${taskId}/documents`, docData);
    return res.data;
  },

  // Audit Templates
  getTemplates: async () => {
    const res = await axiosInstance.get('/firm-admin/tasks/templates');
    return res.data;
  },

  createTemplate: async (templateData) => {
    const res = await axiosInstance.post('/firm-admin/tasks/templates', templateData);
    return res.data;
  },

  // Dependencies
  addDependency: async (taskId, dependsOnTaskId) => {
    const res = await axiosInstance.post(`/firm-admin/tasks/${taskId}/dependencies`, { dependsOnTaskId });
    return res.data;
  },
};
