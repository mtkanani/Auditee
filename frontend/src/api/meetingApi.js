import axiosInstance from '../services/axiosInstance';

export const meetingApi = {
  // Schedule new meeting
  schedule: async (data) => {
    const response = await axiosInstance.post('/meetings', data);
    return response.data;
  },

  // Get list of meetings with optional search & filters
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/meetings', { params });
    return response.data;
  },

  // Get meeting details by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/meetings/${id}`);
    return response.data;
  },

  // Update meeting status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
  updateStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/meetings/${id}/status`, { status });
    return response.data;
  },

  // Respond to meeting invitation (ACCEPTED, REJECTED, MAYBE)
  respondInvite: async (id, status) => {
    const response = await axiosInstance.post(`/meetings/${id}/respond`, { status });
    return response.data;
  },

  // Join meeting room & record attendance
  joinMeeting: async (id) => {
    const response = await axiosInstance.post(`/meetings/${id}/join`);
    return response.data;
  },

  // Save Minutes of Meeting (MoM) note
  addNote: async (id, noteData) => {
    const response = await axiosInstance.post(`/meetings/${id}/notes`, noteData);
    return response.data;
  },

  // ✨ Convert MoM Notes to Auditee Tasks via AI Engine
  convertMoMToTasks: async (id, notesText) => {
    const response = await axiosInstance.post(`/meetings/${id}/convert-mom`, { notesText });
    return response.data;
  },
  // Invite participant to live meeting
  inviteParticipant: async (id, participantData) => {
    const response = await axiosInstance.post(`/meetings/${id}/invite`, participantData);
    return response.data;
  },
};

export default meetingApi;
