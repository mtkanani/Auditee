import React from 'react';
import { DollarSign } from 'lucide-react';

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
    <form onSubmit={handleAddProposalSubmit} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
        <DollarSign size="1em" className="text-emerald-400"  /> Attach Fee Quotation / Proposal
      </h4>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <input
            type="text"
            required
            placeholder="Proposal Title (e.g. Annual Audit & Tax Filing Quotation)"
            value={proposalTitle}
            onChange={(e) => setProposalTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
          />
        </div>
        <div>
          <input
            type="number"
            required
            placeholder="Proposed Fee (₹)"
            value={proposedFee}
            onChange={(e) => setProposedFee(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
          />
        </div>
      </div>
      <textarea
        rows={2}
        placeholder="Scope of work & payment terms description..."
        value={proposalScope}
        onChange={(e) => setProposalScope(e.target.value)}
        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
      />
      <button
        type="submit"
        disabled={addProposalMutation.isPending}
        className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg"
      >
        {addProposalMutation.isPending ? 'Saving Proposal...' : 'Save & Update Stage to PROPOSAL SENT'}
      </button>
    </form>

    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
      {lead.proposals?.map((p) => (
        <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-100 text-xs">{p.proposalTitle}</span>
            <span className="text-xs font-bold text-emerald-400">
              ₹{Number(p.proposedFee || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-slate-400">{p.scopeDescription || 'Standard CA engagement terms'}</p>
        </div>
      ))}
    </div>
  </div>
);
