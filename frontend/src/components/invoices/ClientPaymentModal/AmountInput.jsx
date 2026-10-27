import React from 'react';

export const AmountInput = ({ invoice, amountToPay, setAmountToPay }) => (
  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
    <div>
      <label className="block text-xs font-semibold text-slate-400">Amount to Pay (₹)</label>
      <input
        type="number"
        step="0.01"
        min="1"
        max={invoice.balanceAmount}
        required
        value={amountToPay}
        onChange={(e) => setAmountToPay(e.target.value)}
        className="bg-transparent text-xl font-black text-emerald-400 focus:outline-none w-40"
      />
    </div>
    <button
      type="button"
      onClick={() => setAmountToPay(invoice.balanceAmount)}
      className="py-1 px-2.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-extrabold hover:bg-indigo-900 transition-colors cursor-pointer"
    >
      Pay Full Balance (₹{Number(invoice.balanceAmount).toLocaleString('en-IN')})
    </button>
  </div>
);
