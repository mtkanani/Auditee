import axiosInstance from './axiosInstance';

export const notificationService = {
  list: async (limit = 20) => {
    const res = await axiosInstance.get('/notifications', { params: { limit } });
    return res.data?.data || { items: [], unread: 0 };
  },

  markRead: async (id) => {
    const res = await axiosInstance.patch(`/notifications/${id}/read`);
    return res.data;
  },

  markAllRead: async () => {
    const res = await axiosInstance.post('/notifications/read-all');
    return res.data;
  },
};
