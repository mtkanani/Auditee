import React from 'react';

export const getLeadColumns = ({ setSelectedLeadId, setIsDetailModalOpen, handleStageUpdate }) => [
  {
    header: 'Lead Name & Company',
    key: 'leadName',
    render: (r) => (
      <div
        onClick={() => {
          setSelectedLeadId(r.id);
          setIsDetailModalOpen(true);
        }}
        className="cursor-pointer group"
      >
        <p className="font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors">{r.leadName}</p>
        <p className="text-xs text-slate-400">{r.companyName || 'Individual'} • {r.email}</p>
      </div>
    ),
  },
  { header: 'Phone', key: 'phone', render: (r) => r.phone || 'N/A' },
  { header: 'Interested Services', key: 'interestedServices', render: (r) => r.interestedServices || 'General CA Audit' },
  {
    header: 'Est. Value',
    key: 'estimatedValue',
    render: (r) => <span className="font-bold text-emerald-400">₹{Number(r.estimatedValue || 0).toLocaleString('en-IN')}</span>,
  },
  {
    header: 'Stage',
    key: 'stage',
    render: (r) => (
      <select
        value={r.stage}
        onChange={(e) => handleStageUpdate(r.id, e.target.value)}
        className="text-xs font-bold bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-indigo-400 focus:outline-none"
      >
        <option value="NEW_LEAD">NEW LEAD</option>
        <option value="DISCUSSION">DISCUSSION</option>
        <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
        <option value="WON">WON</option>
        <option value="LOST">LOST</option>
      </select>
    ),
  },
  {
    header: 'Actions',
    key: 'actions',
    render: (r) => (
      <button
        onClick={() => {
          setSelectedLeadId(r.id);
          setIsDetailModalOpen(true);
        }}
        className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/30 text-xs font-bold"
      >
        Manage CRM
      </button>
    ),
  },
];
