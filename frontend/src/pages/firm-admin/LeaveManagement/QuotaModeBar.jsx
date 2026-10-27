import React from 'react';

export const QuotaModeBar = ({ displayQuotaMode, setDisplayQuotaMode, myLeaveData }) => (
  <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80">
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-300">Quota Breakdown Display:</span>
      <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setDisplayQuotaMode('YEARLY')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            displayQuotaMode === 'YEARLY' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Per Year (Annual Limit)
        </button>
        <button
          onClick={() => setDisplayQuotaMode('MONTHLY')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            displayQuotaMode === 'MONTHLY' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Per Month (Accrual Rate)
        </button>
      </div>
    </div>

    {myLeaveData.policy && (
      <span className="text-[11px] text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
        Default Firm Policy: <strong>{myLeaveData.policy.accrualMode}</strong> Accrual
      </span>
    )}
  </div>
);
