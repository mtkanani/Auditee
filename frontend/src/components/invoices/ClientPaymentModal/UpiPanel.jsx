import React from 'react';
import { Check, Copy } from 'lucide-react';

export const UpiPanel = ({ qrCodeImageUrl, payAmountVal, firmName, upiId, handleCopyUpi, copiedUpi, utrNumber, setUtrNumber }) => (
  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
    <div className="flex flex-col items-center justify-center">
      <div className="p-3 bg-white rounded-2xl shadow-xl mb-3 border-2 border-indigo-500/40 inline-block text-center">
        <img
          src={qrCodeImageUrl}
          alt="UPI Dynamic Payment QR Code"
          className="w-44 h-44 object-contain rounded-lg mx-auto"
        />
        <span className="block text-[10px] text-slate-800 font-extrabold mt-1.5 uppercase tracking-wider">
          Auto Amount: ₹{Number(payAmountVal).toLocaleString('en-IN')}
        </span>
      </div>
                  
      <p className="text-xs font-bold text-slate-200">Scan QR Code with Google Pay, PhonePe, Paytm or BHIM</p>
      <p className="text-[11px] text-slate-400">Payee: <strong className="text-indigo-300">{firmName}</strong> ({upiId})</p>
    </div>

    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 max-w-sm mx-auto">
      <span className="text-xs font-mono font-bold text-indigo-400">{upiId}</span>
      <button
        type="button"
        onClick={handleCopyUpi}
        className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
      >
        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
      </button>
    </div>

    <div className="text-left max-w-sm mx-auto">
      <label className="block text-xs font-semibold text-slate-300 mb-1">Enter UPI Transaction / UTR Ref Number (Optional)</label>
      <input
        type="text"
        placeholder="e.g. 324156987012"
        value={utrNumber}
        onChange={(e) => setUtrNumber(e.target.value)}
        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
      />
    </div>
  </div>
);
