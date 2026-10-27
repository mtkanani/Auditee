import React from 'react';
import { InvoiceSheetHeader } from './InvoiceSheetHeader';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { InvoiceTotals } from './InvoiceTotals';

export const InvoiceSheet = ({ invoice }) => (
  <div className="p-8 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 space-y-6 shadow-2xl print:bg-white print:text-black print:p-0 print:border-none">
    {/* Invoice Top Brand Header */}
    <InvoiceSheetHeader invoice={invoice} />

    {/* Line Items Table */}
    <InvoiceItemsTable invoice={invoice} />

    {/* GST Summary & Totals */}
    <InvoiceTotals invoice={invoice} />

    {/* Payment Logs History */}
    {invoice.payments?.length > 0 && (
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
        <span className="font-bold text-slate-300 block">Recorded Payment History:</span>
        {invoice.payments.map((p) => (
          <div key={p.id} className="flex justify-between text-slate-400 text-[11px]">
            <span>{new Date(p.paymentDate).toLocaleDateString()} • {p.paymentMode} ({p.referenceNumber || 'N/A'})</span>
            <span className="font-bold text-emerald-400">₹{Number(p.amount).toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);
