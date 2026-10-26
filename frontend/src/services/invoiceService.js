import axiosInstance from './axiosInstance';
import { getRole } from '../utils/helpers';

const getBaseUrl = () => {
  return getRole() === 'CLIENT' ? '/client/invoices' : '/firm-admin/invoices';
};


export const invoiceService = {
  getAllInvoices: async (params = {}) => {
    const res = await axiosInstance.get(getBaseUrl(), { params });
    return res.data;
  },

  getInvoiceById: async (id) => {
    const res = await axiosInstance.get(`${getBaseUrl()}/${id}`);
    return res.data;
  },

  createInvoice: async (data) => {
    const res = await axiosInstance.post('/firm-admin/invoices', data);
    return res.data;
  },

  recordPayment: async (id, data) => {
    const res = await axiosInstance.post(`${getBaseUrl()}/${id}/payments`, data);
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
    const res = await axiosInstance.get(`${getBaseUrl()}/bank-details`);
    return res.data;
  },

  updateBankDetails: async (data) => {
    const res = await axiosInstance.put('/firm-admin/invoices/bank-details', data);
    return res.data;
  },

  updateFirmBankDetails: async (data) => {
    const res = await axiosInstance.put('/firm-admin/invoices/bank-details', data);
    return res.data;
  },
};
