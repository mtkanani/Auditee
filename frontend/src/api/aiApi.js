import axiosInstance from '../services/axiosInstance';

export const aiApi = {
  /**
   * Send copilot query for a given sub-AI mode
   * @param {Object} payload { mode: 'trainee' | 'admin' | 'document' | 'client', message: string, history?: Array }
   */
  askCopilot: async (payload) => {
    const response = await axiosInstance.post('/ai/copilot', payload);
    return response.data;
  },
};

export default aiApi;
