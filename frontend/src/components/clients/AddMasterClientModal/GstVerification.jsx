import React from 'react';
import { CircleAlert, CircleCheckBig, RefreshCw, Shield } from 'lucide-react';

export const GstVerification = ({
  gstNumberInput,
  setGstNumberInput,
  isVerified,
  setVerificationResult,
  fieldErrors,
  setFieldErrors,
  handleVerifyGst,
  isVerifying,
  verificationResult,
}) => (
  <div className="space-y-3">
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
        GSTIN (15-Digit Goods & Services Tax Identification Number) *
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={gstNumberInput}
          onChange={(e) => {
            setGstNumberInput(e.target.value.toUpperCase());
            if (isVerified) setVerificationResult(null);
            if (fieldErrors.gstNumberInput) setFieldErrors((prev) => ({ ...prev, gstNumberInput: null }));
          }}
          placeholder="e.g. 24AAAAA0000A1Z5"
          maxLength={15}
          className={`flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs font-mono text-slate-100 uppercase tracking-wider focus:outline-none transition-all ${
            fieldErrors.gstNumberInput
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-950/20 text-rose-200'
              : 'border-slate-800 focus:border-indigo-500'
          }`}
        />
        <button
          type="button"
          onClick={handleVerifyGst}
          disabled={isVerifying || !gstNumberInput.trim()}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin"  />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4"  />
              <span>Verify GST</span>
            </>
          )}
        </button>
      </div>
      {fieldErrors.gstNumberInput && (
        <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1.5 animate-fadeIn">
          <CircleAlert className="w-3.5 h-3.5 text-rose-400 shrink-0"  />
          <span>{fieldErrors.gstNumberInput}</span>
        </p>
      )}
    </div>

    {/* GST Verification Status Result */}
    {verificationResult?.type === 'GST' && (
      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-2.5 animate-fadeIn">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
          <span className="font-extrabold text-emerald-400 flex items-center gap-1.5 text-xs">
            <CircleCheckBig className="w-4 h-4"  />
            GSTIN VERIFIED & ACTIVE ({verificationResult.data.gstNumber})
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {verificationResult.data.gstStatus || 'ACTIVE'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-300">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Legal Business Name</p>
            <p className="font-extrabold text-slate-100 text-xs mt-0.5">{verificationResult.data.legalName}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Trade / Brand Name</p>
            <p className="font-bold text-slate-200 text-xs mt-0.5">{verificationResult.data.tradeName}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Auto-Extracted PAN</p>
            <p className="font-mono font-extrabold text-purple-300 text-xs mt-0.5">{verificationResult.data.panNumber}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">State & Jurisdiction</p>
            <p className="font-bold text-slate-200 text-xs mt-0.5">Code {verificationResult.data.stateCode} ({verificationResult.data.stateName})</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Constitution Entity</p>
            <p className="font-bold text-indigo-300 text-xs mt-0.5">{verificationResult.data.constitution || 'PRIVATE LIMITED'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Taxpayer Type</p>
            <p className="font-bold text-emerald-400 text-xs mt-0.5">{verificationResult.data.taxpayerType || 'Regular'}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);
