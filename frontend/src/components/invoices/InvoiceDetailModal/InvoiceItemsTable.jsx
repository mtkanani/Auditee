import React from 'react';
import { inr } from './money';

export const InvoiceItemsTable = ({ invoice }) => (
  <div className="overflow-x-auto rounded-xl border border-line">
    <table className="w-full min-w-[560px] text-left text-sm border-collapse">
      <thead>
        <tr className="bg-sunken/60 text-xs font-medium text-subtle">
          <th className="py-2.5 px-4 w-10">#</th>
          <th className="py-2.5 px-4">Service</th>
          <th className="py-2.5 px-4">SAC</th>
          <th className="py-2.5 px-4 text-center">Qty</th>
          <th className="py-2.5 px-4 text-right">Rate</th>
          <th className="py-2.5 px-4 text-right">Amount</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {invoice.items?.map((item, index) => (
          <tr key={item.id}>
            <td className="py-3 px-4 text-subtle tabular-nums">{index + 1}</td>
            <td className="py-3 px-4 font-medium text-fg">{item.description}</td>
            <td className="py-3 px-4 text-muted tabular-nums">{item.sacCode || '998231'}</td>
            <td className="py-3 px-4 text-center text-fg tabular-nums">{item.quantity}</td>
            <td className="py-3 px-4 text-right text-muted tabular-nums">{inr(item.unitPrice)}</td>
            <td className="py-3 px-4 text-right font-medium text-fg tabular-nums">{inr(item.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
