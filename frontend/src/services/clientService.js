import axiosInstance from './axiosInstance';

export const clientService = {
  getDashboard: async () => {
    const res = await axiosInstance.get('/client/dashboard');
    return res.data;
  },

  getProfile: async () => {
    const res = await axiosInstance.get('/client/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await axiosInstance.put('/client/profile', data);
    return res.data;
  },

  getMyUser: async () => {
    const res = await axiosInstance.get('/client/my-user');
    return res.data;
  },

  createTask: async (taskData) => {
    const res = await axiosInstance.post('/client/tasks', taskData);
    return res.data;
  },

  getTasks: async (params = {}) => {
    const res = await axiosInstance.get('/client/tasks', { params });
    return res.data;
  },

  getTaskById: async (taskId) => {
    const res = await axiosInstance.get(`/client/tasks/${taskId}`);
    return res.data;
  },

  uploadTaskDocument: async (taskId, formData) => {
    const res = await axiosInstance.post(`/client/tasks/${taskId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
