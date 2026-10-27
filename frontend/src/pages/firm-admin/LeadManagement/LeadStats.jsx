import React from 'react';
import { CircleCheckBig, FileText, MessageSquare, Users } from 'lucide-react';
import { StatsCard } from '../../../components/common/StatsCard';

export const LeadStats = ({ totalLeads, inDiscussionCount, proposalSentCount, wonValueTotal }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    <StatsCard title="Total Active Leads" value={totalLeads} icon={Users} color="indigo" />
    <StatsCard title="Leads in Discussion" value={inDiscussionCount} icon={MessageSquare} color="purple" />
    <StatsCard title="Proposals Sent" value={proposalSentCount} icon={FileText} color="amber" />
    <StatsCard
      title="Converted Won Value"
      value={`₹${wonValueTotal.toLocaleString('en-IN')}`}
      icon={CircleCheckBig}
      color="emerald"
    />
  </div>
);
