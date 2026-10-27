import React from 'react';
import { Lock, LockOpen } from 'lucide-react';

export const VerificationBanner = ({ isVerified, verificationResult }) => (
  <div
    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
      isVerified
        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
        : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-xl ${
          isVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
        }`}
      >
        {isVerified ? <LockOpen className="w-5 h-5"  /> : <Lock className="w-5 h-5"  />}
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider">
          {isVerified ? 'Tax Identity Verified & Unlocked' : 'Step 1: Mandatory Tax Verification'}
        </h4>
        <p className="text-[11px] opacity-80">
          {isVerified
            ? `Verified via ${verificationResult.type} (${
                verificationResult.type === 'GST'
                  ? verificationResult.data.gstNumber
                  : verificationResult.data.panNumber
              })`
            : 'Verify GSTIN or PAN below to unlock full account profile entry.'}
        </p>
      </div>
    </div>
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
        isVerified
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      }`}
    >
      {isVerified ? 'Verified' : 'Gated / Locked'}
    </span>
  </div>
);
