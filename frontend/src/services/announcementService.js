import axiosInstance from './axiosInstance';

export const announcementService = {
  createNotice: async (noticeData) => {
    const res = await axiosInstance.post('/firm-admin/announcements', noticeData);
    return res.data;
  },

  getAdminNotices: async () => {
    const res = await axiosInstance.get('/firm-admin/announcements');
    return res.data;
  },

  getNoticeAnalytics: async (id) => {
    const res = await axiosInstance.get(`/firm-admin/announcements/${id}/analytics`);
    return res.data;
  },

  deleteNotice: async (id) => {
    const res = await axiosInstance.delete(`/firm-admin/announcements/${id}`);
    return res.data;
  },

  getUserNotices: async () => {
    const res = await axiosInstance.get('/user/announcements');
    return res.data;
  },

  acknowledgeNotice: async (id) => {
    const res = await axiosInstance.post(`/user/announcements/${id}/acknowledge`);
    return res.data;
  },
};
