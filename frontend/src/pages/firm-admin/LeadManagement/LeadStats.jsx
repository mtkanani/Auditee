import React from 'react';
import { CircleCheckBig, FileText, MessageSquare, Users } from 'lucide-react';
import { StatCard } from '../../../components/ui';
import { inr } from './pipelineStages';

/** Server-side totals over every matching lead. The two middle cards filter the board to that stage. */
export const LeadStats = ({ totalLeads, inDiscussionCount, proposalSentCount, wonValueTotal, setStageFilter }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
    <StatCard label="Leads" value={totalLeads} icon={Users} />
    <StatCard
      label="In discussion"
      value={inDiscussionCount}
      icon={MessageSquare}
      tone="neutral"
      hint="show only these"
      onClick={() => setStageFilter('DISCUSSION')}
    />
    <StatCard
      label="Proposals sent"
      value={proposalSentCount}
      icon={FileText}
      tone="warning"
      hint="show only these"
      onClick={() => setStageFilter('PROPOSAL_SENT')}
    />
    <StatCard label="Won value" value={inr(wonValueTotal)} icon={CircleCheckBig} tone="success" />
  </div>
);
