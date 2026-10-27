import React from 'react';

export const InvoiceTotals = ({ invoice }) => (
  <div className="flex justify-end pt-4 border-t border-slate-800">
    <div className="w-64 space-y-1.5 text-xs">
      <div className="flex justify-between text-slate-400">
        <span>Subtotal:</span>
        <span className="font-bold text-slate-200">₹{Number(invoice.subTotal).toLocaleString('en-IN')}</span>
      </div>

      {!invoice.isInterState ? (
        <>
          <div className="flex justify-between text-slate-400">
            <span>CGST (9%):</span>
            <span className="font-bold text-indigo-400">+₹{Number(invoice.cgstAmount).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>SGST (9%):</span>
            <span className="font-bold text-indigo-400">+₹{Number(invoice.sgstAmount).toLocaleString('en-IN')}</span>
          </div>
        </>
      ) : (
        <div className="flex justify-between text-slate-400">
          <span>IGST (18%):</span>
          <span className="font-bold text-indigo-400">+₹{Number(invoice.igstAmount).toLocaleString('en-IN')}</span>
        </div>
      )}

      <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-slate-100">
        <span>Total Amount:</span>
        <span className="text-emerald-400">₹{Number(invoice.totalAmount).toLocaleString('en-IN')}</span>
      </div>

      <div className="flex justify-between text-slate-400">
        <span>Paid Amount:</span>
        <span className="font-bold text-emerald-400">₹{Number(invoice.paidAmount).toLocaleString('en-IN')}</span>
      </div>

      <div className="flex justify-between text-xs font-extrabold text-rose-400 pt-1 border-t border-slate-800">
        <span>Outstanding Balance:</span>
        <span>₹{Number(invoice.balanceAmount).toLocaleString('en-IN')}</span>
      </div>
    </div>
  </div>
);
