import axiosInstance from './axiosInstance';

export const getEvents = async (params) => {
  const res = await axiosInstance.get('/api/events', { params, withCredentials: true });
  return res.data.data; // assumes { data: [...] }
};

export const createEvent = async (payload) => {
  const res = await axiosInstance.post('/api/events', payload, { withCredentials: true });
  return res.data;
};
