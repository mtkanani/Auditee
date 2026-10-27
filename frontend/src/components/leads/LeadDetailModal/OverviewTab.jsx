import React from 'react';

export const OverviewTab = ({ lead }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
      <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">Contact & Business Profile</h4>
      <div className="text-xs text-slate-300 space-y-2">
        <p><strong className="text-slate-400">Name:</strong> {lead.leadName}</p>
        <p><strong className="text-slate-400">Company:</strong> {lead.companyName || 'N/A'}</p>
        <p><strong className="text-slate-400">Business Type:</strong> {lead.businessType || 'N/A'}</p>
        <p><strong className="text-slate-400">Email:</strong> {lead.email}</p>
        <p><strong className="text-slate-400">Phone:</strong> {lead.phone || 'N/A'}</p>
        <p><strong className="text-slate-400">GSTIN / PAN:</strong> {lead.gstNumber || lead.panNumber || 'N/A'}</p>
      </div>
    </div>

    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
      <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">Services Required & Notes</h4>
      <div className="text-xs text-slate-300 space-y-2">
        <p><strong className="text-slate-400">Interested CA Services:</strong></p>
        <p className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-indigo-300 font-semibold">
          {lead.interestedServices || 'General Audit & Compliance Services'}
        </p>
        <p><strong className="text-slate-400">Lead Notes:</strong></p>
        <p className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-300">
          {lead.notes || 'No specific notes recorded for this lead.'}
        </p>
      </div>
    </div>
  </div>
);
