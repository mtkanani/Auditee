import axiosInstance from './axiosInstance';

export const firmService = {
  /**
   * Get all firms with search, pagination, and status filters.
   * @param {object} params { page, limit, search, status }
   */
  getFirms: async (params) => {
    const response = await axiosInstance.get('/admin/firms', { params });
    return response.data;
  },

  /**
   * Get details of a specific firm.
   * @param {number|string} firmId
   */
  getFirmById: async (firmId) => {
    const response = await axiosInstance.get(`/admin/firms/${firmId}`);
    return response.data;
  },

  /**
   * Create a new firm and its admin user.
   * @param {object} payload { firm, firmAdmin }
   */
  createFirm: async (payload) => {
    const response = await axiosInstance.post('/admin/firms', payload);
    return response.data;
  },

  /**
   * Update firm details.
   * @param {number|string} firmId
   * @param {object} firmData
   */
  updateFirm: async (firmId, firmData) => {
    const response = await axiosInstance.put(`/admin/firms/${firmId}`, firmData);
    return response.data;
  },

  /**
   * Update firm admin user details.
   * @param {number|string} firmId
   * @param {object} adminData
   */
  updateFirmAdmin: async (firmId, adminData) => {
    const response = await axiosInstance.put(`/admin/firms/${firmId}/admin`, adminData);
    return response.data;
  },

  /**
   * Change status of a firm (ACTIVE, INACTIVE, SUSPENDED).
   * @param {number|string} firmId
   * @param {string} status
   */
  changeFirmStatus: async (firmId, status) => {
    const response = await axiosInstance.patch(`/admin/firms/${firmId}/status`, { status });
    return response.data;
  },

  /**
   * Reset the password of the firm's admin user.
   * @param {number|string} firmId
   * @param {string} newPassword
   */
  resetFirmAdminPassword: async (firmId, newPassword) => {
    const response = await axiosInstance.post(`/admin/firms/${firmId}/admin/reset-password`, { newPassword });
    return response.data;
  },

  /**
   * Soft delete a firm.
   * @param {number|string} firmId
   */
  deleteFirm: async (firmId) => {
    const response = await axiosInstance.delete(`/admin/firms/${firmId}`);
    return response.data;
  },
};
