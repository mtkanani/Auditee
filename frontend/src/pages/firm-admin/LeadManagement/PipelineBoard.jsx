import React from 'react';
import { ArrowRight } from 'lucide-react';
import { pipelineStages } from './pipelineStages';

export const PipelineBoard = ({ leads, setSelectedLeadId, setIsDetailModalOpen }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
    {pipelineStages.map((stage) => {
      const stageLeads = leads.filter((l) => l.stage === stage.key);
      const totalStageValue = stageLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

      return (
        <div key={stage.key} className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800 p-3 min-h-[500px]">
          {/* Column Header */}
          <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${stage.color}`}>
            <span className="text-[11px] font-extrabold uppercase tracking-wider">{stage.title}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/60">{stageLeads.length}</span>
          </div>

          <div className="text-[10px] text-slate-500 font-bold px-1 mb-2">
            Total Value: ₹{totalStageValue.toLocaleString('en-IN')}
          </div>

          {/* Cards Container */}
          <div className="space-y-3 flex-1 overflow-y-auto">
            {stageLeads.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedLeadId(item.id);
                  setIsDetailModalOpen(true);
                }}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2 shadow-lg group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">{item.companyName || 'Individual'}</span>
                  <span className="text-[10px] font-extrabold text-emerald-400">
                    ₹{Number(item.estimatedValue || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors">
                  {item.leadName}
                </h4>
                <p className="text-[11px] text-indigo-300 line-clamp-1">{item.interestedServices || 'CA Audit Services'}</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>📞 {item.phone || item.email}</span>
                  {item.stage === 'WON' ? (
                    <span className="text-emerald-400 font-bold">Converted</span>
                  ) : (
                    <span className="text-slate-500 group-hover:text-indigo-400 flex items-center gap-0.5">
                      Manage <ArrowRight size="1em" />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {stageLeads.length === 0 && (
              <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-[11px] text-slate-600">
                No leads in this stage
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);
