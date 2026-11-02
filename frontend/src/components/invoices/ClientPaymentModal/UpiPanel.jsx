import React from 'react';
import { Check, Copy } from 'lucide-react';
import { Button, Field, Input } from '../../ui';

export const UpiPanel = ({ qrCodeImageUrl, payAmountVal, firmName, upiId, handleCopyUpi, copiedUpi, utrNumber, setUtrNumber }) => (
  <div className="p-4 rounded-2xl bg-sunken/50 border border-line space-y-4">
    <div className="flex flex-col items-center text-center gap-2">
      <div className="p-3 bg-white rounded-2xl shadow-card">
        <img src={qrCodeImageUrl} alt={`UPI QR code to pay ₹${payAmountVal} to ${firmName}`} className="w-44 h-44 object-contain" />
        <span className="block text-[11px] text-slate-800 font-semibold mt-1.5 tabular-nums">
          ₹{Number(payAmountVal).toLocaleString('en-IN')}
        </span>
      </div>
      <p className="text-sm font-medium text-fg">Scan with Google Pay, PhonePe, Paytm or BHIM</p>
      <p className="text-xs text-muted">Paying {firmName}</p>
    </div>

    {upiId && (
      <div className="flex items-center justify-between gap-2 p-2 pl-3 rounded-xl bg-surface border border-line max-w-sm mx-auto">
        <span className="text-sm font-mono text-fg truncate">{upiId}</span>
        <Button type="button" size="sm" variant="ghost" icon={copiedUpi ? Check : Copy} onClick={handleCopyUpi}>
          {copiedUpi ? 'Copied' : 'Copy'}
        </Button>
      </div>
    )}

    <Field label="UPI reference (UTR)" hint="Optional. Helps your firm match the payment." className="max-w-sm mx-auto">
      {(p) => (
        <Input {...p} inputMode="numeric" placeholder="12-digit number" value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} />
      )}
    </Field>
  </div>
);
