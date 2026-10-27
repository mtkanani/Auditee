import React from 'react';
import { CreditCard, Landmark, QrCode, Wallet } from 'lucide-react';

export const MethodSelector = ({ paymentMethod, setPaymentMethod }) => (
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
);
