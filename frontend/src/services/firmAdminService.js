import axiosInstance from './axiosInstance';

export const firmAdminService = {
  // Users Management APIs
  createUser: async (userData) => {
    const res = await axiosInstance.post('/firm-admin/users', userData);
    return res.data;
  },

  getUsers: async (params = {}) => {
    const res = await axiosInstance.get('/firm-admin/users', { params });
    return res.data;
  },

  getUserById: async (userId) => {
    const res = await axiosInstance.get(`/firm-admin/users/${userId}`);
    return res.data;
  },

  updateUser: async (userId, userData) => {
    const res = await axiosInstance.put(`/firm-admin/users/${userId}`, userData);
    return res.data;
  },

  deleteUser: async (userId) => {
    const res = await axiosInstance.delete(`/firm-admin/users/${userId}`);
    return res.data;
  },

  updateUserStatus: async (userId, status) => {
    const res = await axiosInstance.patch(`/firm-admin/users/${userId}/status`, { status });
    return res.data;
  },

  resetUserPassword: async (userId, newPassword) => {
    const res = await axiosInstance.post(`/firm-admin/users/${userId}/reset-password`, { newPassword });
    return res.data;
  },

  // Clients Management APIs
  createClient: async (clientData) => {
    const res = await axiosInstance.post('/firm-admin/clients', clientData);
    return res.data;
  },

  getClients: async (params = {}) => {
    const res = await axiosInstance.get('/firm-admin/clients', { params });
    return res.data;
  },

  getClientById: async (clientId) => {
    const res = await axiosInstance.get(`/firm-admin/clients/${clientId}`);
    return res.data;
  },

  updateClient: async (clientId, clientData) => {
    const res = await axiosInstance.put(`/firm-admin/clients/${clientId}`, clientData);
    return res.data;
  },

  deleteClient: async (clientId) => {
    const res = await axiosInstance.delete(`/firm-admin/clients/${clientId}`);
    return res.data;
  },

  updateClientStatus: async (clientId, status) => {
    const res = await axiosInstance.patch(`/firm-admin/clients/${clientId}/status`, { status });
    return res.data;
  },

  // Dashboard API
  getDashboard: async () => {
    const res = await axiosInstance.get('/firm-admin/dashboard');
    return res.data;
  },
};
