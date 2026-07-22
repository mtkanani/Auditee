import axiosInstance from './axiosInstance';

export const complianceService = {
  getAllComplianceItems: async (params = {}) => {
    const res = await axiosInstance.get('/firm-admin/compliance', { params });
    return res.data;
  },

  createComplianceItem: async (data) => {
    const res = await axiosInstance.post('/firm-admin/compliance', data);
    return res.data;
  },

  generateIndianPresets: async (year, month) => {
    const res = await axiosInstance.post('/firm-admin/compliance/generate-indian-presets', { year, month });
    return res.data;
  },

  updateComplianceStatus: async (id, status) => {
    const res = await axiosInstance.patch(`/firm-admin/compliance/${id}/status`, { status });
    return res.data;
  },

  convertToTask: async (id, taskOptions = {}) => {
    const res = await axiosInstance.post(`/firm-admin/compliance/${id}/create-task`, taskOptions);
    return res.data;
  },

  sendReminder: async (id) => {
    const res = await axiosInstance.post(`/firm-admin/compliance/${id}/send-reminder`);
    return res.data;
  },
};
