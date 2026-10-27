import { useState } from 'react';
import { useBankDetails, useRecordPayment } from '../../../queries/useInvoices';

export const useClientPayment = ({ invoice, isOpen }) => {
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI | CARD | NET_BANKING | WALLET
  const [amountToPay, setAmountToPay] = useState(invoice?.balanceAmount || 0);

  const { bankDetails: fetchedBankDetails } = useBankDetails({ enabled: isOpen });
  const recordPaymentMutation = useRecordPayment();

  // Dynamic Firm Bank Details
  const bankDetails = {
    bankName: fetchedBankDetails?.bankName || '',
    accountNumber: fetchedBankDetails?.accountNumber || '',
    ifscCode: fetchedBankDetails?.ifscCode || '',
    accountHolderName: invoice?.firm?.firmName || fetchedBankDetails?.accountHolderName || '',
    branchName: fetchedBankDetails?.branchName || '',
    upiId: fetchedBankDetails?.upiId || '',
  };

  // Form input states
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [walletPhone, setWalletPhone] = useState('');

  const [paymentSuccess, setPaymentSuccess] = useState(null);

  return {
    paymentMethod,
    setPaymentMethod,
    amountToPay,
    setAmountToPay,
    recordPaymentMutation,
    bankDetails,
    utrNumber,
    setUtrNumber,
    copiedUpi,
    setCopiedUpi,
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCvv,
    setCardCvv,
    cardName,
    setCardName,
    selectedBank,
    setSelectedBank,
    walletPhone,
    setWalletPhone,
    paymentSuccess,
    setPaymentSuccess,
  };
};
