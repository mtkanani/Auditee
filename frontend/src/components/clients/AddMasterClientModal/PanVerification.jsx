import React from 'react';
import { CircleCheckBig, ShieldCheck } from 'lucide-react';
import { Button, Field, Input } from '../../ui';
import { Fact } from './StepCard';

export const PanVerification = ({
  panNumberInput,
  setPanNumberInput,
  isVerified,
  setVerificationResult,
  handleVerifyPan,
  isVerifying,
  verificationResult,
}) => (
  <div className="space-y-4">
    <Field label="PAN" required hint="10 characters, e.g. ABCDE1234F">
      {(p) => (
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              {...p}
              value={panNumberInput}
              onChange={(e) => {
                setPanNumberInput(e.target.value.toUpperCase());
                if (isVerified) setVerificationResult(null);
              }}
              placeholder="ABCDE1234F"
              maxLength={10}
              className="font-mono uppercase tracking-wider"
            />
          </div>
          <Button variant="primary" icon={ShieldCheck} loading={isVerifying} disabled={!panNumberInput.trim()} onClick={handleVerifyPan}>
            Verify
          </Button>
        </div>
      )}
    </Field>

    {verificationResult?.type === 'PAN' && (
      <div className="rounded-xl border border-success/30 bg-success-soft/60 p-4 space-y-3 animate-fade-in">
        <p className="flex items-center gap-2 text-sm font-medium text-success">
          <CircleCheckBig className="w-4 h-4" aria-hidden="true" />
          <span className="font-mono">{verificationResult.data.panNumber}</span> is valid
        </p>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Fact label="Entity type" value={verificationResult.data.entityType} />
          <Fact label="Status" value={verificationResult.data.panStatus} />
        </dl>
      </div>
    )}
  </div>
);
