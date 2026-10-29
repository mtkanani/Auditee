import React from 'react';
import { TriangleAlert } from 'lucide-react';
import { Field, Input } from '../../ui';
import { cn } from '../../../lib/cn';

const BANKS = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Punjab National', 'Kotak Bank'];

const Row = ({ label, value }) => (
  <div className="min-w-0">
    <dt className="text-xs text-subtle">{label}</dt>
    <dd className="text-sm font-medium text-fg truncate">{value || '—'}</dd>
  </div>
);

export const NetBankingPanel = ({ selectedBank, setSelectedBank, bankDetails, utrNumber, setUtrNumber }) => (
  <div className="p-4 rounded-2xl bg-sunken/50 border border-line space-y-4">
    <fieldset>
      <legend className="block text-sm font-medium text-fg mb-2">Your bank</legend>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup">
        {BANKS.map((bank) => (
          <button
            key={bank}
            type="button"
            role="radio"
            aria-checked={selectedBank === bank}
            onClick={() => setSelectedBank(bank)}
            className={cn(
              'h-10 px-2 rounded-xl border text-xs font-medium transition-colors truncate',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
              selectedBank === bank ? 'border-accent bg-accent-soft text-fg' : 'border-line bg-surface text-muted hover:text-fg'
            )}
          >
            {bank}
          </button>
        ))}
      </div>
    </fieldset>

    <div className="p-3 rounded-xl bg-surface border border-line">
      <p className="text-sm font-medium text-fg mb-2">Firm account for NEFT / RTGS / IMPS</p>
      {bankDetails.bankName || bankDetails.accountNumber ? (
        <dl className="grid grid-cols-2 gap-3">
          <Row label="Bank" value={bankDetails.bankName} />
          <Row label="Account number" value={bankDetails.accountNumber} />
          <Row label="IFSC" value={bankDetails.ifscCode} />
          <Row label="Branch" value={bankDetails.branchName} />
        </dl>
      ) : (
        <p className="flex items-center gap-2 text-xs text-warning">
          <TriangleAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
          Your firm hasn't added its bank details yet.
        </p>
      )}
    </div>

    <Field label="Bank reference (UTR)">
      {(p) => <Input {...p} value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} />}
    </Field>
  </div>
);
