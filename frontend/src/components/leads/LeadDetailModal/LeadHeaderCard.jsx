import React from 'react';
import { CircleCheckBig, Zap } from 'lucide-react';

export const LeadHeaderCard = ({ lead, handleStageChange, handleConvertToClient, convertToClientMutation }) => (
  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-extrabold text-white text-lg shadow-lg">
        {lead.leadName.charAt(0)}
      </div>
      <div>
        <h3 className="font-extrabold text-slate-100 text-base">{lead.leadName}</h3>
        <p className="text-xs text-slate-400">
          {lead.companyName ? `${lead.companyName} • ` : ''}
          {lead.email} • {lead.phone || 'No Phone'}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
            Est. Value: ₹{Number(lead.estimatedValue || 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400">Source: {lead.source || 'DIRECT'}</span>
        </div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <div>
        <span className="text-[10px] text-slate-500 font-bold uppercase block">Pipeline Stage</span>
        <select
          value={lead.stage}
          onChange={(e) => handleStageChange(e.target.value)}
          className="text-xs font-bold bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-indigo-400 focus:outline-none focus:border-indigo-500"
        >
          <option value="NEW_LEAD">NEW LEAD</option>
          <option value="DISCUSSION">DISCUSSION</option>
          <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
          <option value="WON">WON</option>
          <option value="LOST">LOST</option>
        </select>
      </div>

      {lead.stage !== 'WON' ? (
        <button
          onClick={handleConvertToClient}
          disabled={convertToClientMutation.isPending}
          className="w-full sm:w-auto py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5"
        >
          <Zap className="w-4 h-4"  />
          <span>{convertToClientMutation.isPending ? 'Converting...' : 'Convert to Client'}</span>
        </button>
      ) : (
        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-extrabold flex items-center gap-1">
          <CircleCheckBig size="1em" /> Converted to Client
        </span>
      )}
    </div>
  </div>
);
