import React from 'react';

export const BillingTab = ({ client }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Outstanding Balance
        </span>
        <p className="text-2xl font-extrabold text-rose-400">
          ₹{client.outstandingBalance?.toLocaleString() || 0}
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Payment Terms
        </span>
        <p className="text-lg font-bold text-slate-200">{client.paymentTerms || 'NET_30'}</p>
      </div>

      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Tax Registration Type
        </span>
        <p className="text-lg font-bold text-indigo-400">{client.taxRegistrationType || 'REGULAR'}</p>
      </div>
    </div>

    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
      <h4 className="text-sm font-bold text-slate-200">Billing Address & Notes</h4>
      <div className="text-xs space-y-2">
        <div>
          <span className="text-slate-400">Billing Address:</span>
          <p className="font-semibold text-slate-200">{client.billingAddress || client.address || 'Same as registered address'}</p>
        </div>
        <div>
          <span className="text-slate-400">Billing Notes / Fee Agreements:</span>
          <p className="font-semibold text-slate-300">{client.billingNotes || 'No specific notes recorded'}</p>
        </div>
      </div>
    </div>
  </div>
);
