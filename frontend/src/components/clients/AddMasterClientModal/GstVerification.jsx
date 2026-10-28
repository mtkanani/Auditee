import React from 'react';
import { CircleCheckBig, ShieldCheck } from 'lucide-react';
import { Badge, Button, Field, Input } from '../../ui';
import { Fact } from './StepCard';

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
  <div className="space-y-4">
    <Field label="GSTIN" required error={fieldErrors.gstNumberInput} hint="15 characters, e.g. 24AAAAA0000A1Z5">
      {(p) => (
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              {...p}
              value={gstNumberInput}
              onChange={(e) => {
                setGstNumberInput(e.target.value.toUpperCase());
                if (isVerified) setVerificationResult(null);
                if (fieldErrors.gstNumberInput) setFieldErrors((prev) => ({ ...prev, gstNumberInput: null }));
              }}
              placeholder="24AAAAA0000A1Z5"
              maxLength={15}
              className="font-mono uppercase tracking-wider"
            />
          </div>
          <Button variant="primary" icon={ShieldCheck} loading={isVerifying} disabled={!gstNumberInput.trim()} onClick={handleVerifyGst}>
            Verify
          </Button>
        </div>
      )}
    </Field>

    {verificationResult?.type === 'GST' && (
      <div className="rounded-xl border border-success/30 bg-success-soft/60 p-4 space-y-3 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-medium text-success">
            <CircleCheckBig className="w-4 h-4" aria-hidden="true" />
            <span className="font-mono">{verificationResult.data.gstNumber}</span> is valid
          </p>
          <Badge tone="success">{verificationResult.data.gstStatus || 'Active'}</Badge>
        </div>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
          <Fact label="Legal name" value={verificationResult.data.legalName} />
          <Fact label="Trade name" value={verificationResult.data.tradeName} />
          <Fact label="PAN" value={verificationResult.data.panNumber} mono />
          <Fact label="State" value={`${verificationResult.data.stateCode || ''} ${verificationResult.data.stateName ? `(${verificationResult.data.stateName})` : ''}`.trim()} />
          <Fact
            label="Constitution"
            value={(verificationResult.data.constitution || 'PRIVATE_LIMITED').toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()).replace(/\bllp\b/i, 'LLP')}
          />
          <Fact label="Taxpayer type" value={verificationResult.data.taxpayerType || 'Regular'} />
        </dl>
      </div>
    )}
  </div>
);
