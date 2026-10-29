import React from 'react';
import { InvoiceSheetHeader } from './InvoiceSheetHeader';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { InvoiceTotals } from './InvoiceTotals';
import { inr, longDate } from './money';

const MODE_LABELS = { BANK_TRANSFER: 'Bank transfer', UPI: 'UPI', CHEQUE: 'Cheque', CASH: 'Cash' };

export const InvoiceSheet = ({ invoice }) => (
  <div className="p-5 sm:p-8 rounded-2xl bg-surface border border-line shadow-card space-y-6 print:bg-white print:text-black print:p-0 print:border-none">
    <InvoiceSheetHeader invoice={invoice} />

    <InvoiceItemsTable invoice={invoice} />

    <InvoiceTotals invoice={invoice} />

    {invoice.payments?.length > 0 && (
      <div className="rounded-xl border border-line overflow-hidden">
        <p className="px-4 py-2.5 text-xs font-medium text-subtle bg-sunken/60 border-b border-line">Payments received</p>
        <ul className="divide-y divide-line">
          {invoice.payments.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
              <span className="text-muted min-w-0 truncate">
                {longDate(p.paymentDate)} · {MODE_LABELS[p.paymentMode] || p.paymentMode}
                {p.referenceNumber ? ` · ${p.referenceNumber}` : ''}
              </span>
              <span className="font-medium text-success tabular-nums shrink-0">{inr(p.amount)}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
