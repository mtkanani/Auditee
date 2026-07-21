import axiosInstance from './axiosInstance';

export const assignmentService = {
  assignClient: async (userId, clientId, notes = '') => {
    const res = await axiosInstance.post('/firm-admin/client-assignments', {
      userId,
      clientId,
      notes,
    });
    return res.data;
  },

  getAllAssignments: async (params = {}) => {
    const res = await axiosInstance.get('/firm-admin/client-assignments', { params });
    return res.data;
  },

  getUserClients: async (userId) => {
    const res = await axiosInstance.get(`/firm-admin/users/${userId}/clients`);
    return res.data;
  },

  getClientUsers: async (clientId) => {
    const res = await axiosInstance.get(`/firm-admin/clients/${clientId}/users`);
    return res.data;
  },

  removeAssignment: async (userId, clientId) => {
    const res = await axiosInstance.delete('/firm-admin/client-assignments', {
      data: { userId, clientId },
    });
    return res.data;
  },

  createTask: async (taskData) => {
    const res = await axiosInstance.post('/firm-admin/tasks', taskData);
    return res.data;
  },

  getFirmTasks: async (params = {}) => {
    const res = await axiosInstance.get('/firm-admin/tasks', { params });
    return res.data;
  },
};
