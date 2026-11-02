import React from 'react';
import { cn } from '../../../lib/cn';
import { inr } from './money';

const Row = ({ label, value, className }) => (
  <div className={cn('flex justify-between gap-4 text-muted', className)}>
    <span>{label}</span>
    <span className="font-medium tabular-nums">{value}</span>
  </div>
);

export const InvoiceTotals = ({ invoice }) => {
  const balance = Number(invoice.balanceAmount || 0);
  return (
    <div className="flex justify-end">
      <div className="w-full sm:w-72 space-y-2 text-sm">
        <Row label="Subtotal" value={inr(invoice.subTotal)} className="[&>span:last-child]:text-fg" />
        {!invoice.isInterState ? (
          <>
            <Row label="CGST 9%" value={`+${inr(invoice.cgstAmount)}`} className="[&>span:last-child]:text-fg" />
            <Row label="SGST 9%" value={`+${inr(invoice.sgstAmount)}`} className="[&>span:last-child]:text-fg" />
          </>
        ) : (
          <Row label="IGST 18%" value={`+${inr(invoice.igstAmount)}`} className="[&>span:last-child]:text-fg" />
        )}

        <div className="pt-2 border-t border-line flex items-baseline justify-between gap-4">
          <span className="font-medium text-fg">Total</span>
          <span className="text-lg font-semibold text-fg tabular-nums">{inr(invoice.totalAmount)}</span>
        </div>

        <Row label="Paid" value={inr(invoice.paidAmount)} className="[&>span:last-child]:text-success" />

        <div
          className={cn(
            'flex justify-between gap-4 px-3 py-2 rounded-lg font-medium',
            balance > 0 ? 'bg-danger-soft text-danger' : 'bg-success-soft text-success'
          )}
        >
          <span>Balance due</span>
          <span className="tabular-nums">{inr(balance)}</span>
        </div>
      </div>
    </div>
  );
};
