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
    bankName: 'ICICI Bank',
    accountNumber: '987654321012',
    ifscCode: 'ICIC0001234',
    accountHolderName: invoice?.firm?.firmName || 'Codelix CA Firm',
    branchName: 'PNTC Vejalpur, Ahmedabad Main',
    upiId: 'codelix.ca@okicici',
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

  const upiId = bankDetails.upiId || 'codelix.ca@okicici';
  const firmName = invoice.firm?.firmName || bankDetails.accountHolderName || 'Codelix CA Firm';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCompletePayment = async (e) => {
    e.preventDefault();
    const payAmountNum = parseFloat(amountToPay);

    if (!payAmountNum || payAmountNum <= 0) {
      toast.error('Please enter a valid payment amount.');
      return;
    }

    if (payAmountNum > invoice.balanceAmount + 0.01) {
      toast.error(`Amount cannot exceed balance due (₹${Number(invoice.balanceAmount).toLocaleString('en-IN')})`);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate 1.5s secure gateway authorization delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const refNo =
        utrNumber ||
        (paymentMethod === 'CARD'
          ? `CARD-TXN-${Date.now().toString().slice(-6)}`
          : `ONLINE-TXN-${Date.now().toString().slice(-6)}`);

      const updatedInvoice = await invoiceService.recordPayment(invoice.id, {
        amount: payAmountNum,
        paymentMode: paymentMethod === 'UPI' ? 'UPI' : paymentMethod === 'CARD' ? 'BANK_TRANSFER' : paymentMethod === 'NET_BANKING' ? 'BANK_TRANSFER' : 'UPI',
        referenceNumber: refNo,
      });

      setPaymentSuccess({
        transactionId: refNo,
        amount: payAmountNum,
        date: new Date().toLocaleString(),
        paymentMethod,
      });

      toast.success('Payment successfully authorized & recorded!');
      if (onPaymentSuccess) onPaymentSuccess(updatedInvoice);
    } catch (err) {
      toast.error(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <span>Pay Invoice: {invoice.invoiceNumber}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-bold uppercase">
                  Secure Checkout
                </span>
              </h3>
              <p className="text-xs text-slate-400">Total Outstanding Balance: <strong className="text-emerald-400">₹{Number(invoice.balanceAmount).toLocaleString('en-IN')}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {paymentSuccess ? (
          /* Payment Success Celebration Screen */
          <div className="p-8 text-center space-y-5 flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-2xl animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-100">Payment Successful!</h2>
              <p className="text-xs text-slate-400 mt-1">Your payment receipt has been issued to {invoice.client?.email}</p>
            </div>

            <div className="w-full max-w-md p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-left">
              <div className="flex justify-between text-slate-400">
                <span>Transaction Ref ID:</span>
                <span className="font-bold text-slate-200">{paymentSuccess.transactionId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="font-extrabold text-emerald-400">₹{Number(paymentSuccess.amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Method:</span>
                <span className="font-bold text-indigo-400">{paymentSuccess.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Date & Time:</span>
                <span className="text-slate-300">{paymentSuccess.date}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="py-3 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Done & Return to Billing
            </button>
          </div>
        ) : (
          /* Payment Form View */
          <form onSubmit={handleCompletePayment} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Amount Input */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Payment Amount (₹)</label>
                <p className="text-[10px] text-slate-500">You can pay full or partial balance</p>
              </div>
              <div className="relative w-44">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amountToPay}
                  onChange={(e) => setAmountToPay(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-black text-base focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Select Payment Gateway Method</label>
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
                  <CreditCard className="w-5 h-5 text-purple-400" />
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
                  <div className="p-3 bg-white rounded-2xl shadow-xl mb-3 border-2 border-indigo-500/40 inline-block">
                    {/* Interactive QR SVG */}
                    <svg className="w-36 h-36" viewBox="0 0 100 100">
                      <path d="M0,0 h30 v30 h-30 z M40,0 h20 v10 h-20 z M70,0 h30 v30 h-30 z M0,40 h10 v20 h-10 z M30,40 h40 v20 h-40 z M80,40 h20 v40 h-20 z M0,70 h30 v30 h-30 z M40,70 h30 v30 h-30 z" fill="#0f172a" />
                      <rect x="5" y="5" width="20" height="20" fill="#2563eb" />
                      <rect x="75" y="5" width="20" height="20" fill="#2563eb" />
                      <rect x="5" y="75" width="20" height="20" fill="#2563eb" />
                      <circle cx="50" cy="50" r="10" fill="#10b981" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-slate-200">Scan QR Code with Google Pay, PhonePe, or Paytm</p>
                  <p className="text-[11px] text-slate-400">Paying to: <strong className="text-indigo-300">{firmName}</strong></p>
                </div>

                {/* Copy UPI ID */}
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

                {/* UTR Input */}
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
                  <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px]">
                    <div>Bank: <strong className="text-slate-200">{bankDetails.bankName || 'ICICI Bank'}</strong></div>
                    <div>Account #: <strong className="text-slate-200">{bankDetails.accountNumber || '987654321012'}</strong></div>
                    <div>IFSC Code: <strong className="text-slate-200">{bankDetails.ifscCode || 'ICIC0001234'}</strong></div>
                    <div>Branch: <strong className="text-slate-200">{bankDetails.branchName || 'Ahmedabad Main'}</strong></div>
                  </div>
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
