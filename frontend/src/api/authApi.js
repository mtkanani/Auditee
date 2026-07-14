import axiosInstance from '../services/axiosInstance';

export const authApi = {
  /**
   * Request an OTP for registration
   * @param {string} email
   */
  sendOTP: async (email) => {
    const response = await axiosInstance.post('/auth/send-otp', { email });
    return response.data;
  },

  /**
   * Verify registration OTP
   * @param {string} email
   * @param {string} otp
   */
  verifyOTP: async (email, otp) => {
    const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  /**
   * Register a new user
   * @param {object} userData { firstName, lastName, mobileNumber, email, password, confirmPassword, city, role }
   */
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  /**
   * User login
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Request OTP for forgot password
   * @param {string} email
   */
  forgotPasswordOTP: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password/send-otp', { email });
    return response.data;
  },

  /**
   * Verify forgot password OTP
   * @param {string} email
   * @param {string} otp
   */
  verifyForgotOTP: async (email, otp) => {
    const response = await axiosInstance.post('/auth/forgot-password/verify-otp', { email, otp });
    return response.data;
  },

  /**
   * Reset user password using verified OTP
   * @param {string} email
   * @param {string} newPassword
   * @param {string} confirmPassword
   */
  resetPassword: async (email, newPassword, confirmPassword) => {
    const response = await axiosInstance.post('/auth/forgot-password/reset-password', {
      email,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  /**
   * Change user password (authenticated)
   * @param {string} email
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  changePassword: async (email, currentPassword, newPassword) => {
    const response = await axiosInstance.post('/auth/change-password', {
      email,
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Request account deletion OTP
   * @param {string} email
   */
  sendDeleteOTP: async (email) => {
    const response = await axiosInstance.post('/account/delete/send-otp', { email });
    return response.data;
  },

  /**
   * Verify account deletion OTP
   * @param {string} email
   * @param {string} otp
   */
  verifyDeleteOTP: async (email, otp) => {
    const response = await axiosInstance.post('/account/delete/verify-otp', { email, otp });
    return response.data;
  },

  /**
   * Confirm account deletion
   * @param {string} email
   */
  deleteAccount: async (email) => {
    const response = await axiosInstance.delete('/account/delete', {
      data: { email },
    });
    return response.data;
  },
};
