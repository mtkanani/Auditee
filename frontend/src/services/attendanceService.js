import axiosInstance from './axiosInstance';

export const attendanceService = {
  getTodayStatus: async () => {
    const res = await axiosInstance.get('/attendance/today');
    return res.data;
  },

  checkIn: async (data = {}) => {
    const res = await axiosInstance.post('/attendance/check-in', data);
    return res.data;
  },

  checkOut: async (data = {}) => {
    const res = await axiosInstance.post('/attendance/check-out', data);
    return res.data;
  },

  getMyLogs: async (params = {}) => {
    const res = await axiosInstance.get('/attendance/my-logs', { params });
    return res.data;
  },

  getFirmReport: async (params = {}) => {
    const res = await axiosInstance.get('/attendance/firm-report', { params });
    return res.data;
  },
};
