import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { pipelineStages, inr } from './pipelineStages';

const LeadCard = ({ lead, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen(lead)}
    className="w-full text-left p-3.5 rounded-xl bg-surface border border-line shadow-card space-y-2.5 transition-all duration-150 hover:border-line-strong hover:shadow-raised hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
  >
    <div className="min-w-0">
      <p className="text-sm font-medium text-fg truncate">{lead.leadName}</p>
      <p className="text-xs text-subtle truncate">{lead.companyName || 'Individual'}</p>
    </div>
    <p className="text-xs text-muted line-clamp-2">{lead.interestedServices || 'CA Audit Services'}</p>
    <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-line text-xs">
      <span className="flex items-center gap-1.5 min-w-0 text-subtle">
        {lead.phone ? <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> : <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
        <span className="truncate">{lead.phone || lead.email}</span>
      </span>
      <span className="text-sm font-medium text-fg tabular-nums shrink-0">{inr(lead.estimatedValue)}</span>
    </div>
  </button>
);

/** Five stage columns. Columns scroll sideways on narrow screens instead of squashing. */
export const PipelineBoard = ({ leads, isLoading, setSelectedLeadId, setIsDetailModalOpen }) => {
  const open = (lead) => {
    setSelectedLeadId(lead.id);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
      <div className="grid grid-flow-col auto-cols-[minmax(210px,1fr)] gap-3 min-w-full">
        {pipelineStages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.key);
          const totalStageValue = stageLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

          return (
            <section key={stage.key} aria-label={stage.title} className="rounded-2xl bg-sunken/70 border border-line p-3 min-h-[60vh] flex flex-col">
              <header className="px-1 pb-3">
                <div className="flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full', stage.dot)} aria-hidden="true" />
                  <h3 className="text-sm font-medium text-fg">{stage.title}</h3>
                  <span className="ml-auto text-xs font-medium text-subtle tabular-nums">{isLoading ? '' : stageLeads.length}</span>
                </div>
                {!isLoading && <p className="text-xs text-subtle mt-1 pl-4 tabular-nums">{inr(totalStageValue)}</p>}
              </header>

              <div className="space-y-2.5 flex-1">
                {isLoading
                  ? Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-surface border border-line space-y-2.5">
                        <div className="h-3.5 w-3/4 rounded-full bg-hover animate-pulse" />
                        <div className="h-3 w-1/2 rounded-full bg-hover animate-pulse" />
                      </div>
                    ))
                  : stageLeads.map((item) => <LeadCard key={item.id} lead={item} onOpen={open} />)}

                {!isLoading && stageLeads.length === 0 && (
                  <p className="text-xs text-subtle text-center py-8 border border-dashed border-line rounded-xl">No leads here</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
