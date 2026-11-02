import React from 'react';
import { Lock, LockOpen } from 'lucide-react';
import { cn } from '../../../lib/cn';

/** Tells the user whether the tax ID check has unlocked the rest of the form. */
export const VerificationBanner = ({ isVerified, verificationResult }) => (
  <div
    className={cn(
      'flex items-center gap-3 rounded-2xl px-4 py-3 border',
      isVerified ? 'bg-success-soft border-success/25' : 'bg-accent-soft border-accent/20'
    )}
  >
    <span className={cn('grid place-items-center w-9 h-9 rounded-xl shrink-0', isVerified ? 'bg-success/15 text-success' : 'bg-accent/15 text-accent-fg')}>
      {isVerified ? <LockOpen className="w-[18px] h-[18px]" aria-hidden="true" /> : <Lock className="w-[18px] h-[18px]" aria-hidden="true" />}
    </span>
    <div className="min-w-0">
      <p className={cn('text-sm font-medium', isVerified ? 'text-success' : 'text-accent-fg')}>
        {isVerified ? 'Tax ID verified' : 'Start by verifying a tax ID'}
      </p>
      <p className="text-xs text-muted truncate">
        {isVerified
          ? `Checked via ${verificationResult.type}: ${verificationResult.type === 'GST' ? verificationResult.data.gstNumber : verificationResult.data.panNumber}`
          : 'Verify the GSTIN (or PAN for unregistered clients) to fill in the rest.'}
      </p>
    </div>
  </div>
);
