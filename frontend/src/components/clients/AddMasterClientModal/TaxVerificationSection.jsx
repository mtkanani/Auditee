import React from 'react';
import { GstVerification } from './GstVerification';
import { PanVerification } from './PanVerification';
import { StepCard } from './StepCard';

export const TaxVerificationSection = (props) => {
  const { isGstExempt, setIsGstExempt, setVerificationResult, isVerified } = props;

  return (
    <StepCard
      step={1}
      done={isVerified}
      title="Verify tax registration"
      description={isGstExempt ? 'Unregistered client: verify their PAN.' : 'We fetch the legal name and details from the GSTIN.'}
      aside={
        <label className="flex items-center gap-2 text-xs font-medium text-muted cursor-pointer select-none whitespace-nowrap">
          <input
            type="checkbox"
            checked={isGstExempt}
            onChange={(e) => {
              setIsGstExempt(e.target.checked);
              setVerificationResult(null);
            }}
            className="w-4 h-4 rounded accent-[var(--accent)]"
          />
          No GSTIN
        </label>
      }
    >
      {!isGstExempt ? <GstVerification {...props} /> : <PanVerification {...props} />}
    </StepCard>
  );
};
