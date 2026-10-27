import React from 'react';
import { DollarSign, Mail, Printer, Zap } from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

export const InvoiceActionToolbar = ({
  invoice,
  handleConvertProforma,
  convertProformaMutation,
  handleSendEmail,
  sendEmailMutation,
  handlePrint,
  isPaymentFormOpen,
  setIsPaymentFormOpen,
}) => (
  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-400">Status:</span>
      <StatusBadge status={invoice.status} />
      {invoice.invoiceType === 'PROFORMA' && (
        <button
          onClick={handleConvertProforma}
          disabled={convertProformaMutation.isPending}
          className="py-1 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shadow-md"
        >
          <Zap size="1em" /> {convertProformaMutation.isPending ? 'Converting...' : 'Convert to Tax Invoice'}
        </button>
      )}
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={handleSendEmail}
        disabled={sendEmailMutation.isPending}
        className="py-1.5 px-3 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/20 hover:bg-purple-600/30 disabled:opacity-50 text-xs font-bold flex items-center gap-1.5"
      >
        <Mail size="1em" /> {sendEmailMutation.isPending ? 'Sending...' : 'Send Email'}
      </button>

      <button
        onClick={handlePrint}
        className="py-1.5 px-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5"
      >
        <Printer size="1em" /> Print / Download PDF
      </button>

      {invoice.status !== 'PAID' && (
        <button
          onClick={() => setIsPaymentFormOpen(!isPaymentFormOpen)}
          className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
        >
          <DollarSign size="1em" /> Record Payment
        </button>
      )}
    </div>
  </div>
);
