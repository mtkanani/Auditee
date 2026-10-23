import axiosInstance from './axiosInstance';
import { getRole } from '../utils/helpers';

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
    const url = getRole() === 'CLIENT' ? '/client/announcements' : '/user/announcements';
    const res = await axiosInstance.get(url);
    return res.data;
  },

  acknowledgeNotice: async (id) => {
    const url = getRole() === 'CLIENT' ? `/client/announcements/${id}/acknowledge` : `/user/announcements/${id}/acknowledge`;
    const res = await axiosInstance.post(url);
    return res.data;
  },
};

