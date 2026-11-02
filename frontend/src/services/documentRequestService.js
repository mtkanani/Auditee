import axiosInstance from './axiosInstance';

export const documentRequestService = {
  list: async (status = 'PENDING') => {
    const res = await axiosInstance.get('/document-requests', { params: { status } });
    return res.data?.data || [];
  },

  create: async (data) => {
    const res = await axiosInstance.post('/document-requests', data);
    return res.data;
  },

  setStatus: async (id, status) => {
    const res = await axiosInstance.patch(`/document-requests/${id}`, { status });
    return res.data;
  },

  remind: async (id) => {
    const res = await axiosInstance.post(`/document-requests/${id}/remind`);
    return res.data;
  },
};
