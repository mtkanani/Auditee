import React from 'react';
import { Modal } from '../../common/Modal';
import { useClientPayment } from './useClientPayment';
import { createPaymentHandlers } from './paymentHandlers';
import { PaymentModalTitle } from './PaymentModalTitle';
import { PaymentSuccess } from './PaymentSuccess';
import { PaymentForm } from './PaymentForm';

export const ClientPaymentModal = ({ invoice, isOpen, onClose, onPaymentSuccess }) => {
  const payment = useClientPayment({ invoice, isOpen });
  const { bankDetails, amountToPay, paymentSuccess } = payment;

  if (!isOpen || !invoice) return null;

  const upiId = bankDetails.upiId || '';
  const firmName = invoice.firm?.firmName || bankDetails.accountHolderName || 'CA Firm';
  const payAmountVal = parseFloat(amountToPay || invoice.balanceAmount || 0).toFixed(2);
  const invoiceRefNo = invoice.invoiceNumber || 'INV-2026';

  // Standard Indian Dynamic UPI Deep Link with auto-amount
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(firmName)}&am=${payAmountVal}&cu=INR&tn=${encodeURIComponent(`Payment for Invoice ${invoiceRefNo}`)}`;
  
  // Real QR Code image URL
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}`;

  const { handleCopyUpi, handleCompletePayment } = createPaymentHandlers({
    ...payment,
    upiId,
    invoice,
    onPaymentSuccess,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<PaymentModalTitle invoice={invoice} />}
      maxWidth="max-w-xl"
    >

        {/* Modal Body */}
        {paymentSuccess ? (
          <PaymentSuccess paymentSuccess={paymentSuccess} onClose={onClose} />
        ) : (
          <PaymentForm
            {...payment}
            invoice={invoice}
            onClose={onClose}
            upiId={upiId}
            firmName={firmName}
            payAmountVal={payAmountVal}
            qrCodeImageUrl={qrCodeImageUrl}
            handleCopyUpi={handleCopyUpi}
            handleCompletePayment={handleCompletePayment}
          />
        )}
    </Modal>
  );
};

export default ClientPaymentModal;
