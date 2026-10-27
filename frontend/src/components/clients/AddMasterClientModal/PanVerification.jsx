import React from 'react';
import { CircleAlert, CircleCheckBig, RefreshCw, Shield } from 'lucide-react';

export const PanVerification = ({
  panNumberInput,
  setPanNumberInput,
  isVerified,
  setVerificationResult,
  handleVerifyPan,
  isVerifying,
  verificationResult,
}) => (
  <div className="space-y-3">
    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
      <CircleAlert className="w-4 h-4 shrink-0 mt-0.5"  />
      <span>
        For small businesses or unregistered clients without GSTIN, valid <strong>PAN Verification</strong> is required to proceed.
      </span>
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
        PAN Number (Permanent Account Number) *
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={panNumberInput}
          onChange={(e) => {
            setPanNumberInput(e.target.value.toUpperCase());
            if (isVerified) setVerificationResult(null);
          }}
          placeholder="e.g. ABCDE1234F"
          maxLength={10}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100 uppercase tracking-wider focus:outline-none focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={handleVerifyPan}
          disabled={isVerifying || !panNumberInput.trim()}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin"  />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4"  />
              <span>Verify PAN</span>
            </>
          )}
        </button>
      </div>
    </div>

    {/* PAN Verification Result */}
    {verificationResult?.type === 'PAN' && (
      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-2 animate-fadeIn">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
            <CircleCheckBig className="w-4 h-4"  />
            PAN Card Verified Active
          </span>
          <span className="text-[10px] font-mono text-slate-300 font-bold">
            {verificationResult.data.panNumber}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1 border-t border-emerald-900/50">
          <div>
            <p className="text-[10px] text-slate-400">Decoded Entity Category</p>
            <p className="font-bold text-slate-100">{verificationResult.data.entityType}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">Verification Record</p>
            <p className="font-semibold text-emerald-300">{verificationResult.data.panStatus}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);
