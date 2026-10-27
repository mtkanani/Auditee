import React from 'react';

export const NetBankingPanel = ({ selectedBank, setSelectedBank, bankDetails, utrNumber, setUtrNumber }) => (
  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-2">Select Your Bank</label>
      <div className="grid grid-cols-3 gap-2">
        {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Punjab National', 'Kotak Bank'].map((bank) => (
          <button
            key={bank}
            type="button"
            onClick={() => setSelectedBank(bank)}
            className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
              selectedBank === bank
                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {bank}
          </button>
        ))}
      </div>
    </div>

    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
      <span className="font-bold text-slate-200 block">Firm Bank Account Details (NEFT/RTGS):</span>
      {bankDetails.bankName || bankDetails.accountNumber ? (
        <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px]">
          <div>Bank: <strong className="text-slate-200">{bankDetails.bankName || 'N/A'}</strong></div>
          <div>Account #: <strong className="text-slate-200">{bankDetails.accountNumber || 'N/A'}</strong></div>
          <div>IFSC Code: <strong className="text-slate-200">{bankDetails.ifscCode || 'N/A'}</strong></div>
          <div>Branch: <strong className="text-slate-200">{bankDetails.branchName || 'N/A'}</strong></div>
        </div>
      ) : (
        <p className="text-[11px] text-amber-400 italic">
          ⚠️ Bank details have not been configured by your CA firm admin yet.
        </p>
      )}
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1">Bank Reference / UTR Number</label>
      <input
        type="text"
        placeholder="e.g. UTR-987654321"
        value={utrNumber}
        onChange={(e) => setUtrNumber(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
      />
    </div>
  </div>
);
