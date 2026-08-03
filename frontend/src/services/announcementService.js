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
    let url = '/user/announcements';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr && JSON.parse(userStr)?.role?.toUpperCase() === 'CLIENT') {
        url = '/client/announcements';
      }
    } catch (e) {}
    const res = await axiosInstance.get(url);
    return res.data;
  },

  acknowledgeNotice: async (id) => {
    let url = `/user/announcements/${id}/acknowledge`;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr && JSON.parse(userStr)?.role?.toUpperCase() === 'CLIENT') {
        url = `/client/announcements/${id}/acknowledge`;
      }
    } catch (e) {}
    const res = await axiosInstance.post(url);
    return res.data;
  },
};
