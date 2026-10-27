import React from 'react';

export const InvoiceItemsTable = ({ invoice }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-xs border-collapse">
      <thead>
        <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-bold uppercase">
          <th className="py-2.5 px-3">#</th>
          <th className="py-2.5 px-3">Description of Services</th>
          <th className="py-2.5 px-3">SAC Code</th>
          <th className="py-2.5 px-3 text-center">Qty</th>
          <th className="py-2.5 px-3 text-right">Unit Price (₹)</th>
          <th className="py-2.5 px-3 text-right">Amount (₹)</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/60">
        {invoice.items?.map((item, index) => (
          <tr key={item.id}>
            <td className="py-2.5 px-3 text-slate-400">{index + 1}</td>
            <td className="py-2.5 px-3 font-semibold text-slate-200">{item.description}</td>
            <td className="py-2.5 px-3 text-slate-400">{item.sacCode || '998231'}</td>
            <td className="py-2.5 px-3 text-center">{item.quantity}</td>
            <td className="py-2.5 px-3 text-right">₹{Number(item.unitPrice).toLocaleString('en-IN')}</td>
            <td className="py-2.5 px-3 text-right font-bold text-slate-100">
              ₹{Number(item.amount).toLocaleString('en-IN')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
