import toast from 'react-hot-toast';

export const createPaymentHandlers = ({
  upiId,
  setCopiedUpi,
  amountToPay,
  invoice,
  recordPaymentMutation,
  paymentMethod,
  utrNumber,
  setPaymentSuccess,
  onPaymentSuccess,
}) => {
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCompletePayment = (e) => {
    e.preventDefault();
    const payAmountNum = parseFloat(amountToPay);

    if (isNaN(payAmountNum) || payAmountNum <= 0) {
      toast.error('Please enter a valid payment amount.');
      return;
    }

    if (payAmountNum > (invoice.balanceAmount || 0) + 0.01) {
      toast.error(`Payment amount cannot exceed balance due (₹${invoice.balanceAmount})`);
      return;
    }

    recordPaymentMutation.mutate(
      {
        invoiceId: invoice.id,
        paymentData: {
          amount: payAmountNum,
          paymentMethod,
          transactionRef: utrNumber.trim() || `TXN-${Date.now().toString().slice(-8)}`,
          notes: `Paid via ${paymentMethod} by Client ${invoice.client?.clientName || ''}`,
        },
      },
      {
        onSuccess: (res) => {
          setPaymentSuccess({
            transactionId: `TXN-${Date.now().toString().slice(-8)}`,
            amountPaid: payAmountNum,
            method: paymentMethod,
            date: new Date().toLocaleString('en-IN'),
            invoiceNumber: invoice.invoiceNumber,
          });

          toast.success(`Payment of ₹${payAmountNum.toLocaleString('en-IN')} recorded successfully!`);
          if (onPaymentSuccess) onPaymentSuccess(res.data);
        },
      }
    );
  };

  return { handleCopyUpi, handleCompletePayment };
};
