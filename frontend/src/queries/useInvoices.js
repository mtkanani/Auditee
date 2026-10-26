import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invoiceService } from '../services/invoiceService';
import { invoiceKeys, dashboardKeys, clientKeys } from './keys';
import toast from 'react-hot-toast';

// ----------------------------------------------------
// QUERIES
// ----------------------------------------------------

export const useFirmInvoices = (filters = {}) => {
  const query = useQuery({
    queryKey: invoiceKeys.list('firm', filters),
    queryFn: () => invoiceService.getAllInvoices(filters),
    placeholderData: keepPreviousData,
  });

  return {
    invoices: query.data?.data || query.data || [],
    pagination: query.data?.pagination,
    ...query,
  };
};

export const useClientInvoices = (filters = {}) => {
  const query = useQuery({
    queryKey: invoiceKeys.list('client', filters),
    queryFn: () => invoiceService.getAllInvoices(filters),
    placeholderData: keepPreviousData,
  });

  return {
    invoices: query.data?.data || query.data || [],
    pagination: query.data?.pagination,
    ...query,
  };
};

export const useInvoiceDetail = (invoiceId, { enabled = true } = {}) => {
  const query = useQuery({
    queryKey: invoiceKeys.detail(invoiceId),
    queryFn: () => invoiceService.getInvoiceById(invoiceId),
    enabled: Boolean(invoiceId && enabled),
  });

  return {
    invoice: query.data?.data ?? query.data,
    ...query,
  };
};

export const useBankDetails = ({ enabled = true } = {}) => {
  const query = useQuery({
    queryKey: invoiceKeys.bankDetails(),
    queryFn: () => invoiceService.getBankDetails(),
    enabled: Boolean(enabled),
  });

  return {
    bankDetails: query.data?.data ?? query.data,
    ...query,
  };
};

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => invoiceService.createInvoice(data),
    onSuccess: (res, variables) => {
      toast.success(
        `${variables.invoiceType === 'PROFORMA' ? 'Proforma' : 'Tax'} Invoice generated successfully!`
      );
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to generate invoice');
    },
  });
};

export const useRecordPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, paymentData }) => invoiceService.recordPayment(invoiceId, paymentData),
    onSuccess: (res, variables) => {
      toast.success('Payment recorded successfully!');
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      if (variables?.invoiceId) {
        queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(variables.invoiceId) });
      }
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to record payment');
    },
  });
};

export const useConvertProforma = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invoiceId) => invoiceService.convertProforma(invoiceId),
    onSuccess: (res, invoiceId) => {
      toast.success('Proforma Invoice converted to Official Tax Invoice!');
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to convert proforma');
    },
  });
};

export const useSendInvoiceEmail = () => {
  return useMutation({
    mutationFn: ({ invoiceId }) => invoiceService.sendInvoiceEmail(invoiceId),
    onSuccess: (res, variables) => {
      toast.success(
        variables.clientEmail
          ? `Invoice emailed to ${variables.clientEmail}!`
          : 'Invoice emailed successfully!'
      );
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to send email');
    },
  });
};

export const useUpdateFirmBankDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bankData) => invoiceService.updateFirmBankDetails(bankData),
    onSuccess: () => {
      toast.success('Firm bank & payment details updated successfully!');
      queryClient.invalidateQueries({ queryKey: invoiceKeys.bankDetails() });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to update bank details.');
    },
  });
};
