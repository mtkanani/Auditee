import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PaymentModalTitle = ({ invoice }) => (
  <div className="flex items-center gap-3">
    <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
      <ShieldCheck className="w-5 h-5" />
    </div>
    <div>
      <span className="block text-base font-extrabold text-slate-100">Make Online Payment</span>
      <span className="block text-xs font-normal text-slate-400">
        Invoice #{invoice.invoiceNumber} • Outstanding Balance: <strong className="text-rose-400">₹{Number(invoice.balanceAmount).toLocaleString('en-IN')}</strong>
      </span>
    </div>
  </div>
);
