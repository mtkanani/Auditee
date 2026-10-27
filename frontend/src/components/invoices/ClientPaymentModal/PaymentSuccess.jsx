import React from 'react';
import { CheckCircle } from 'lucide-react';

export const PaymentSuccess = ({ paymentSuccess, onClose }) => (
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
);
