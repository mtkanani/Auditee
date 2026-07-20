import axiosInstance from './axiosInstance';

export const userService = {
  getDashboard: async () => {
    const res = await axiosInstance.get('/user/dashboard');
    return res.data;
  },

  getProfile: async () => {
    const res = await axiosInstance.get('/user/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await axiosInstance.put('/user/profile', data);
    return res.data;
  },

  getClients: async () => {
    const res = await axiosInstance.get('/user/clients');
    return res.data;
  },

  getTasks: async (params = {}) => {
    const res = await axiosInstance.get('/user/tasks', { params });
    return res.data;
  },

  getTaskById: async (taskId) => {
    const res = await axiosInstance.get(`/user/tasks/${taskId}`);
    return res.data;
  },

  updateTaskStatus: async (taskId, status) => {
    const res = await axiosInstance.patch(`/user/tasks/${taskId}/status`, { status });
    return res.data;
  },

  uploadTaskDocument: async (taskId, formData) => {
    const res = await axiosInstance.post(`/user/tasks/${taskId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  logTimeEntry: async (taskId, entryData) => {
    const res = await axiosInstance.post(`/user/tasks/${taskId}/time-entry`, entryData);
    return res.data;
  },
};
