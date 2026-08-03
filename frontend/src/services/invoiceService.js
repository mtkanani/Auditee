import axiosInstance from './axiosInstance';

export const invoiceService = {
  getAllInvoices: async (params = {}) => {
    const res = await axiosInstance.get('/firm-admin/invoices', { params });
    return res.data;
  },

  getInvoiceById: async (id) => {
    const res = await axiosInstance.get(`/firm-admin/invoices/${id}`);
    return res.data;
  },

  createInvoice: async (data) => {
    const res = await axiosInstance.post('/firm-admin/invoices', data);
    return res.data;
  },

  recordPayment: async (id, data) => {
    const res = await axiosInstance.post(`/firm-admin/invoices/${id}/payments`, data);
    return res.data;
  },

  convertProforma: async (id) => {
    const res = await axiosInstance.post(`/firm-admin/invoices/${id}/convert-proforma`);
    return res.data;
  },

  sendInvoiceEmail: async (id) => {
    const res = await axiosInstance.post(`/firm-admin/invoices/${id}/send-email`);
    return res.data;
  },

  getBankDetails: async () => {
    const res = await axiosInstance.get('/firm-admin/invoices/bank-details');
    return res.data;
  },

  updateBankDetails: async (data) => {
    const res = await axiosInstance.put('/firm-admin/invoices/bank-details', data);
    return res.data;
  },
};
