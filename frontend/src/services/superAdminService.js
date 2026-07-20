import axiosInstance from './axiosInstance';

export const superAdminService = {
  createFirm: async (firmData) => {
    const res = await axiosInstance.post('/admin/firms', firmData);
    return res.data;
  },

  getAllFirms: async (params = {}) => {
    const res = await axiosInstance.get('/admin/firms', { params });
    return res.data;
  },

  getFirmById: async (id) => {
    const res = await axiosInstance.get(`/admin/firms/${id}`);
    return res.data;
  },

  updateFirm: async (id, firmData) => {
    const res = await axiosInstance.put(`/admin/firms/${id}`, firmData);
    return res.data;
  },

  deleteFirm: async (id) => {
    const res = await axiosInstance.delete(`/admin/firms/${id}`);
    return res.data;
  },

  updateFirmStatus: async (id, status) => {
    const res = await axiosInstance.patch(`/admin/firms/${id}/status`, { status });
    return res.data;
  },

  resetFirmAdminPassword: async (id, newPassword) => {
    const res = await axiosInstance.post(`/admin/firms/${id}/reset-admin-password`, { newPassword });
    return res.data;
  },
};
