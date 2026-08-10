import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Landmark,
  Wallet,
  CheckCircle,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { invoiceService } from '../../services/invoiceService';

export const ClientPaymentModal = ({ invoice, isOpen, onClose, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI | CARD | NET_BANKING | WALLET
  const [amountToPay, setAmountToPay] = useState(invoice?.balanceAmount || 0);

  // Dynamic Firm Bank Details
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: invoice?.firm?.firmName || '',
    branchName: '',
    upiId: '',
  });

  // Form input states
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [walletPhone, setWalletPhone] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  useEffect(() => {
    if (isOpen) {
      invoiceService
        .getBankDetails()
        .then((res) => {
          if (res.data) setBankDetails(res.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen || !invoice) return null;

  const upiId = bankDetails.upiId || '';
  const firmName = invoice.firm?.firmName || bankDetails.accountHolderName || 'CA Firm';
  const payAmountVal = parseFloat(amountToPay || invoice.balanceAmount || 0).toFixed(2);
  const invoiceRefNo = invoice.invoiceNumber || 'INV-2026';

  // Standard Indian Dynamic UPI Deep Link with auto-amount
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(firmName)}&am=${payAmountVal}&cu=INR&tn=${encodeURIComponent(`Payment for Invoice ${invoiceRefNo}`)}`;
  
  // Real QR Code image URL
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCompletePayment = async (e) => {
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

    setIsProcessing(true);

    try {
      const res = await invoiceService.recordPayment(invoice.id, {
        amount: payAmountNum,
        paymentMethod,
        transactionRef: utrNumber.trim() || `TXN-${Date.now().toString().slice(-8)}`,
        notes: `Paid via ${paymentMethod} by Client ${invoice.client?.clientName || ''}`,
      });

      setPaymentSuccess({
        transactionId: `TXN-${Date.now().toString().slice(-8)}`,
        amountPaid: payAmountNum,
        method: paymentMethod,
        date: new Date().toLocaleString('en-IN'),
        invoiceNumber: invoice.invoiceNumber,
      });

      toast.success(`Payment of ₹${payAmountNum.toLocaleString('en-IN')} recorded successfully!`);
      if (onPaymentSuccess) onPaymentSuccess(res.data);
    } catch (err) {
      toast.error(err.message || 'Payment processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100">Make Online Payment</h3>
              <p className="text-xs text-slate-400">
                Invoice #{invoice.invoiceNumber} • Outstanding Balance: <strong className="text-rose-400">₹{Number(invoice.balanceAmount).toLocaleString('en-IN')}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {paymentSuccess ? (
          <div className="p-8 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-100">Payment Successful!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Your payment for Invoice <strong className="text-slate-200">{paymentSuccess.invoiceNumber}</strong> has been logged.
              </p>
            </div>

            <div className="w-full max-w-sm p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-200">{paymentSuccess.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-bold text-emerald-400">₹{paymentSuccess.amountPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="font-semibold text-slate-300">{paymentSuccess.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-slate-300">{paymentSuccess.date}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleCompletePayment} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Amount Input */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-slate-400">Amount to Pay (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={invoice.balanceAmount}
                  required
                  value={amountToPay}
                  onChange={(e) => setAmountToPay(e.target.value)}
                  className="bg-transparent text-xl font-black text-emerald-400 focus:outline-none w-40"
                />
              </div>
              <button
                type="button"
                onClick={() => setAmountToPay(invoice.balanceAmount)}
                className="py-1 px-2.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-extrabold hover:bg-indigo-900 transition-colors cursor-pointer"
              >
                Pay Full Balance (₹{Number(invoice.balanceAmount).toLocaleString('en-IN')})
              </button>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Payment Method</label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'CARD'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-teal-400" />
                  <span className="text-xs">Card Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NET_BANKING')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'NET_BANKING'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs">NetBanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('WALLET')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'WALLET'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-amber-400" />
                  <span className="text-xs">Wallet</span>
                </button>
              </div>
            </div>

            {/* TAB 1: UPI / QR CODE */}
            {paymentMethod === 'UPI' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="p-3 bg-white rounded-2xl shadow-xl mb-3 border-2 border-indigo-500/40 inline-block text-center">
                    <img
                      src={qrCodeImageUrl}
                      alt="UPI Dynamic Payment QR Code"
                      className="w-44 h-44 object-contain rounded-lg mx-auto"
                    />
                    <span className="block text-[10px] text-slate-800 font-extrabold mt-1.5 uppercase tracking-wider">
                      Auto Amount: ₹{Number(payAmountVal).toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <p className="text-xs font-bold text-slate-200">Scan QR Code with Google Pay, PhonePe, Paytm or BHIM</p>
                  <p className="text-[11px] text-slate-400">Payee: <strong className="text-indigo-300">{firmName}</strong> ({upiId})</p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 max-w-sm mx-auto">
                  <span className="text-xs font-mono font-bold text-indigo-400">{upiId}</span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
                  </button>
                </div>

                <div className="text-left max-w-sm mx-auto">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enter UPI Transaction / UTR Ref Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 324156987012"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: CREDIT / DEBIT CARD */}
            {paymentMethod === 'CARD' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4532 •••• •••• 8901"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full pl-3.5 pr-12 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <CreditCard className="w-5 h-5 absolute right-3.5 top-2.5 text-slate-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={3}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: NET BANKING */}
            {paymentMethod === 'NET_BANKING' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Select Your Bank</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Punjab National', 'Kotak Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          selectedBank === bank
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                  <span className="font-bold text-slate-200 block">Firm Bank Account Details (NEFT/RTGS):</span>
                  {bankDetails.bankName || bankDetails.accountNumber ? (
                    <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px]">
                      <div>Bank: <strong className="text-slate-200">{bankDetails.bankName || 'N/A'}</strong></div>
                      <div>Account #: <strong className="text-slate-200">{bankDetails.accountNumber || 'N/A'}</strong></div>
                      <div>IFSC Code: <strong className="text-slate-200">{bankDetails.ifscCode || 'N/A'}</strong></div>
                      <div>Branch: <strong className="text-slate-200">{bankDetails.branchName || 'N/A'}</strong></div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-amber-400 italic">
                      ⚠️ Bank details have not been configured by your CA firm admin yet.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bank Reference / UTR Number</label>
                  <input
                    type="text"
                    placeholder="e.g. UTR-987654321"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: WALLET */}
            {paymentMethod === 'WALLET' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Wallet Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 98250 12345"
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <p className="text-xs text-slate-400">Supports Paytm Wallet, Mobikwik, and PhonePe Wallet link.</p>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit Encrypted SSL Gateway</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Authorizing Payment...</span>
                  ) : (
                    <>
                      <span>Pay ₹{Number(amountToPay || 0).toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClientPaymentModal;
