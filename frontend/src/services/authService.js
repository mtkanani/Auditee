import axiosInstance from './axiosInstance';

export const authService = {
  sendOtp: async (email) => {
    const res = await axiosInstance.post('/auth/send-otp', { email });
    return res.data;
  },

  verifyOtp: async (email, otp) => {
    const res = await axiosInstance.post('/auth/verify-otp', { email, otp });
    return res.data;
  },

  register: async (data) => {
    const res = await axiosInstance.post('/auth/register', data);
    return res.data;
  },

  login: async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    return res.data;
  },

  changePassword: async (email, currentPassword, newPassword) => {
    const res = await axiosInstance.post('/auth/change-password', {
      email,
      currentPassword,
      newPassword,
    });
    return res.data;
  },

  sendForgotPasswordOtp: async (email) => {
    const res = await axiosInstance.post('/auth/forgot-password/send-otp', { email });
    return res.data;
  },

  verifyForgotPasswordOtp: async (email, otp) => {
    const res = await axiosInstance.post('/auth/forgot-password/verify-otp', { email, otp });
    return res.data;
  },

  resetPassword: async (email, newPassword, confirmPassword) => {
    const res = await axiosInstance.post('/auth/forgot-password/reset-password', {
      email,
      newPassword,
      confirmPassword,
    });
    return res.data;
  },

  getMe: async () => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
  },
};
