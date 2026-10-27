import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  useInvoiceDetail,
  useRecordPayment,
  useConvertProforma,
  useSendInvoiceEmail,
} from '../../../queries/useInvoices';
import { createPrintHandler } from './printInvoice';

export const useInvoiceDetailModal = ({ invoiceId, isOpen, onRefresh }) => {
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('BANK_TRANSFER');
  const [refNumber, setRefNumber] = useState('');

  const { invoice, isLoading, error } = useInvoiceDetail(invoiceId, {
    enabled: Boolean(isOpen && invoiceId),
  });

  const recordPaymentMutation = useRecordPayment();
  const convertProformaMutation = useConvertProforma();
  const sendEmailMutation = useSendInvoiceEmail();

  useEffect(() => {
    if (invoice?.balanceAmount !== undefined) {
      setPaymentAmount(invoice.balanceAmount || '');
    }
  }, [invoice?.balanceAmount]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load invoice details');
    }
  }, [error]);

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      toast.error('Valid payment amount required');
      return;
    }
    recordPaymentMutation.mutate(
      {
        invoiceId,
        paymentData: {
          amount: parseFloat(paymentAmount),
          paymentMode,
          referenceNumber: refNumber,
        },
      },
      {
        onSuccess: () => {
          setIsPaymentFormOpen(false);
          if (onRefresh) onRefresh();
        },
      }
    );
  };

  const handleConvertProforma = () => {
    convertProformaMutation.mutate(invoiceId, {
      onSuccess: () => {
        if (onRefresh) onRefresh();
      },
    });
  };

  const handleSendEmail = () => {
    sendEmailMutation.mutate({
      invoiceId,
      clientEmail: invoice?.client?.email,
    });
  };

  const handlePrint = createPrintHandler(invoice);

  return {
    invoice,
    isLoading,
    isPaymentFormOpen,
    setIsPaymentFormOpen,
    paymentAmount,
    setPaymentAmount,
    paymentMode,
    setPaymentMode,
    refNumber,
    setRefNumber,
    recordPaymentMutation,
    convertProformaMutation,
    sendEmailMutation,
    handleRecordPayment,
    handleConvertProforma,
    handleSendEmail,
    handlePrint,
  };
};
