import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';

export const PaymentFooter = ({ onClose, recordPaymentMutation, amountToPay }) => (
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
        disabled={recordPaymentMutation.isPending}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
      >
        {recordPaymentMutation.isPending ? (
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
);
