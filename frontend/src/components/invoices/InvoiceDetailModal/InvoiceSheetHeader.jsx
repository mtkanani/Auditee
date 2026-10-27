import React from 'react';

export const InvoiceSheetHeader = ({ invoice }) => (
  <>
    <div className="flex justify-between items-start border-b border-slate-800 pb-6">
      <div>
        <h2 className="text-xl font-black text-indigo-400 tracking-tight">{invoice.firm?.firmName || 'CHARTERED ACCOUNTANTS FIRM'}</h2>
        <p className="text-xs text-slate-400 mt-1">
          {invoice.firm?.address ? `${invoice.firm.address}, ` : ''}
          {invoice.firm?.city} {invoice.firm?.state}
        </p>
        <p className="text-xs text-slate-400">Firm GSTIN: <strong className="text-slate-200">{invoice.firm?.gstNumber || '24ABCDE1234F1Z5'}</strong></p>
        <p className="text-xs text-slate-400">Email: {invoice.firm?.email || 'admin@caworkstation.in'}</p>
      </div>

      <div className="text-right">
        <span className="text-xl font-black uppercase text-indigo-400 block">
          {invoice.invoiceType === 'PROFORMA' ? 'PROFORMA INVOICE' : 'TAX INVOICE'}
        </span>
        <p className="text-sm font-extrabold text-slate-100 mt-1">{invoice.invoiceNumber}</p>
        <p className="text-xs text-slate-400">Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
        <p className="text-xs text-amber-400 font-bold">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
      </div>
    </div>

    {/* Billed To / Client Details */}
    <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
      <div>
        <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Billed To (Client):</span>
        <p className="text-sm font-extrabold text-slate-100 mt-1">{invoice.client?.companyName || invoice.client?.clientName}</p>
        <p className="text-xs text-slate-400">{invoice.client?.email} • {invoice.client?.phone}</p>
        <p className="text-xs text-slate-400">GSTIN: <strong className="text-slate-200">{invoice.client?.gstNumber || 'N/A'}</strong></p>
        <p className="text-xs text-slate-400">PAN: <strong className="text-slate-200">{invoice.client?.panNumber || 'N/A'}</strong></p>
      </div>

      <div>
        <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Supply Details:</span>
        <p className="text-xs text-slate-300 mt-1">Place of Supply: <strong>{invoice.placeOfSupply || '24-GUJARAT'}</strong></p>
        <p className="text-xs text-slate-300">GST Type: <strong>{invoice.isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)'}</strong></p>
      </div>
    </div>
  </>
);
