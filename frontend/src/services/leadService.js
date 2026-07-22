import axiosInstance from './axiosInstance';

export const leadService = {
  getAllLeads: async (params = {}) => {
    const res = await axiosInstance.get('/firm-admin/leads', { params });
    return res.data;
  },

  getLeadById: async (id) => {
    const res = await axiosInstance.get(`/firm-admin/leads/${id}`);
    return res.data;
  },

  createLead: async (data) => {
    const res = await axiosInstance.post('/firm-admin/leads', data);
    return res.data;
  },

  updateLeadStage: async (id, stage) => {
    const res = await axiosInstance.patch(`/firm-admin/leads/${id}/stage`, { stage });
    return res.data;
  },

  addCallLog: async (id, data) => {
    const res = await axiosInstance.post(`/firm-admin/leads/${id}/call-logs`, data);
    return res.data;
  },

  addMeetingNote: async (id, data) => {
    const res = await axiosInstance.post(`/firm-admin/leads/${id}/meeting-notes`, data);
    return res.data;
  },

  addProposal: async (id, data) => {
    const res = await axiosInstance.post(`/firm-admin/leads/${id}/proposals`, data);
    return res.data;
  },

  convertToClient: async (id) => {
    const res = await axiosInstance.post(`/firm-admin/leads/${id}/convert-to-client`);
    return res.data;
  },
};
