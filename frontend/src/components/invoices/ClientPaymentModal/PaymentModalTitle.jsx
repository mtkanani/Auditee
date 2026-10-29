import React from 'react';
import { CreditCard } from 'lucide-react';

export const PaymentModalTitle = ({ invoice }) => (
  <div className="flex items-center gap-3 min-w-0">
    <span className="grid place-items-center w-9 h-9 rounded-xl bg-success-soft text-success shrink-0">
      <CreditCard className="w-5 h-5" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <span className="block text-base font-semibold text-fg">Pay invoice</span>
      <span className="block text-xs font-normal text-muted truncate">
        {invoice.invoiceNumber} · balance <strong className="text-danger font-medium">₹{Number(invoice.balanceAmount).toLocaleString('en-IN')}</strong>
      </span>
    </div>
  </div>
);
