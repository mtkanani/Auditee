import React from 'react';
import { DollarSign } from 'lucide-react';

export const RecordPaymentForm = ({
  handleRecordPayment,
  paymentAmount,
  setPaymentAmount,
  paymentMode,
  setPaymentMode,
  refNumber,
  setRefNumber,
  recordPaymentMutation,
}) => (
  <form onSubmit={handleRecordPayment} className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-3 print:hidden">
    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
      <DollarSign size="1em" /> Log Payment Received
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="block text-[11px] text-slate-300 font-semibold mb-1">Amount Received (₹) *</label>
        <input
          type="number"
          step="0.01"
          required
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-bold"
        />
      </div>
      <div>
        <label className="block text-[11px] text-slate-300 font-semibold mb-1">Payment Mode</label>
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
        >
          <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
          <option value="UPI">UPI / QR Code</option>
          <option value="CHEQUE">Cheque</option>
          <option value="CASH">Cash</option>
        </select>
      </div>
      <div>
        <label className="block text-[11px] text-slate-300 font-semibold mb-1">Transaction Ref #</label>
        <input
          type="text"
          placeholder="e.g. UTR / URN 987654"
          value={refNumber}
          onChange={(e) => setRefNumber(e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
        />
      </div>
    </div>
    <button
      type="submit"
      disabled={recordPaymentMutation.isPending}
      className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md"
    >
      {recordPaymentMutation.isPending ? 'Recording...' : 'Confirm Payment Entry'}
    </button>
  </form>
);
