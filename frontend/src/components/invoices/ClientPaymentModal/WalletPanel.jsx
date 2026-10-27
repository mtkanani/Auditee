import React from 'react';

export const WalletPanel = ({ walletPhone, setWalletPhone }) => (
  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Wallet Mobile Number</label>
      <input
        type="tel"
        placeholder="e.g. 98250 12345"
        value={walletPhone}
        onChange={(e) => setWalletPhone(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
      />
    </div>
    <p className="text-xs text-slate-400">Supports Paytm Wallet, Mobikwik, and PhonePe Wallet link.</p>
  </div>
);
