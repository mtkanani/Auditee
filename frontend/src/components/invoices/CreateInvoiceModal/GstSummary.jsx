import React from 'react';

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const Row = ({ label, value }) => (
  <div className="flex justify-between text-muted">
    <span>{label}</span>
    <span className="font-medium text-fg tabular-nums">{value}</span>
  </div>
);

/** Live subtotal, GST split and total while the invoice is being written. */
export const GstSummary = ({ isInterState, subTotal, cgstAmount, sgstAmount, igstAmount, totalAmount }) => (
  <div className="ml-auto w-full sm:max-w-xs rounded-2xl border border-accent/25 bg-accent-soft/40 p-4 text-sm space-y-2">
    <Row label="Subtotal" value={inr(subTotal)} />
    {isInterState ? (
      <Row label="IGST 18%" value={`+${inr(igstAmount)}`} />
    ) : (
      <>
        <Row label="CGST 9%" value={`+${inr(cgstAmount)}`} />
        <Row label="SGST 9%" value={`+${inr(sgstAmount)}`} />
      </>
    )}
    <div className="pt-2 border-t border-line flex items-baseline justify-between">
      <span className="font-medium text-fg">Total incl. GST</span>
      <span className="text-lg font-semibold text-fg tabular-nums">{inr(totalAmount)}</span>
    </div>
  </div>
);
