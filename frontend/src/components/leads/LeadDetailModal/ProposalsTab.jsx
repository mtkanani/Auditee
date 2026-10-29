import React from 'react';
import { FileText } from 'lucide-react';
import { Button, Field, Input, Textarea } from '../../ui';

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const ProposalsTab = ({
  lead,
  handleAddProposalSubmit,
  proposalTitle,
  setProposalTitle,
  proposedFee,
  setProposedFee,
  proposalScope,
  setProposalScope,
  addProposalMutation,
}) => (
  <div className="space-y-4">
    <form onSubmit={handleAddProposalSubmit} className="rounded-2xl border border-line bg-surface p-5 space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-fg">Add a fee proposal</h4>
        <p className="text-xs text-subtle mt-0.5">Saving moves the lead to Proposal sent.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Title" required className="sm:col-span-2">
          {(p) => <Input {...p} required placeholder="e.g. Annual audit and tax filing" value={proposalTitle} onChange={(e) => setProposalTitle(e.target.value)} />}
        </Field>
        <Field label="Fee (₹)" required>
          {(p) => <Input {...p} type="number" required placeholder="e.g. 60000" value={proposedFee} onChange={(e) => setProposedFee(e.target.value)} />}
        </Field>
      </div>
      <Field label="Scope and payment terms">
        {(p) => <Textarea {...p} rows={2} placeholder="What's included, billing frequency, payment terms" value={proposalScope} onChange={(e) => setProposalScope(e.target.value)} />}
      </Field>
      <div className="flex justify-end">
        <Button type="submit" variant="primary" loading={addProposalMutation.isPending}>Save proposal</Button>
      </div>
    </form>

    {lead.proposals?.length ? (
      <ul className="space-y-3">
        {lead.proposals.map((p) => (
          <li key={p.id} className="rounded-xl border border-line bg-surface p-4 space-y-1">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-fg">{p.proposalTitle}</p>
              <span className="text-sm font-semibold text-fg tabular-nums shrink-0">{inr(p.proposedFee)}</span>
            </div>
            <p className="text-sm text-muted">{p.scopeDescription || 'Standard CA engagement terms'}</p>
          </li>
        ))}
      </ul>
    ) : (
      <div className="flex flex-col items-center py-10 text-center rounded-2xl border border-dashed border-line">
        <FileText className="w-5 h-5 text-subtle mb-2" aria-hidden="true" />
        <p className="text-sm text-muted">No proposals sent yet.</p>
      </div>
    )}
  </div>
);
