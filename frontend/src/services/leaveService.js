import axiosInstance from './axiosInstance';

export const leaveService = {
  applyLeave: async (data) => {
    const res = await axiosInstance.post('/leave/apply', data);
    return res.data;
  },

  getMyLeaveData: async () => {
    const res = await axiosInstance.get('/leave/my-requests');
    return res.data;
  },

  getPendingRequests: async () => {
    const res = await axiosInstance.get('/leave/pending-requests');
    return res.data;
  },

  reviewLeave: async (id, status, adminRemarks = '') => {
    const res = await axiosInstance.patch(`/leave/${id}/review`, { status, adminRemarks });
    return res.data;
  },

  getLeaveCalendar: async (params = {}) => {
    const res = await axiosInstance.get('/leave/calendar', { params });
    return res.data;
  },
};
