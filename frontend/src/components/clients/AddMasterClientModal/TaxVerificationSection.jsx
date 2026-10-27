import React from 'react';
import { GstVerification } from './GstVerification';
import { PanVerification } from './PanVerification';

export const TaxVerificationSection = (props) => {
  const { isGstExempt, setIsGstExempt, setVerificationResult } = props;

  return (
    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
            1
          </span>
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Tax Registration Identifiers & Verification
          </h3>
        </div>

        {/* Exemption Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isGstExempt}
            onChange={(e) => {
              setIsGstExempt(e.target.checked);
              setVerificationResult(null);
            }}
            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-xs font-medium text-amber-400">GST Exempt / Unregistered</span>
        </label>
      </div>

      {!isGstExempt ? (
        /* GST Verification Block */
        <GstVerification {...props} />
      ) : (
        /* PAN Verification Block for Exempt Entities */
        <PanVerification {...props} />
      )}
    </div>
  );
};
