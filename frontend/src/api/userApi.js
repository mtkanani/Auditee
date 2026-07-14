import axiosInstance from '../services/axiosInstance';

export const userApi = {
  /**
   * Fetch a user profile by searching for their email
   * @param {string} email
   */
  getProfile: async (email) => {
    // Search the users database for this specific email
    const response = await axiosInstance.get(`/users?search=${encodeURIComponent(email)}`);
    
    if (response.data && response.data.data) {
      // Find the user entry that matches this email exactly
      const user = response.data.data.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (user) {
        return user;
      }
    }
    throw new Error('User profile not found.');
  },

  /**
   * Update profile details for a user
   * @param {string} userId
   * @param {object} profileData { firstName, lastName, mobileNumber, city }
   */
  updateProfile: async (userId, profileData) => {
    const response = await axiosInstance.put('/users/update-profile', {
      userId,
      ...profileData,
    });
    return response.data;
  },

  /**
   * Fetch paginated/filtered list of users
   * @param {object} params { page, limit, search, role, sortBy, sortOrder }
   */
  getUsers: async (params) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },
};
