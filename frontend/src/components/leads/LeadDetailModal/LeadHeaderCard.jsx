import React from 'react';
import { CircleCheckBig, Zap } from 'lucide-react';
import { Badge, Button, Select, StatusTag } from '../../ui';

const STAGES = [
  { value: 'NEW_LEAD', label: 'New inquiry' },
  { value: 'DISCUSSION', label: 'In discussion' },
  { value: 'PROPOSAL_SENT', label: 'Proposal sent' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
];

const SOURCES = { DIRECT: 'Walk-in or direct', REFERRAL: 'Client referral', WEBSITE: 'Website or Google', COLD_CALL: 'Cold call or email' };

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

/** Modal title: initial, name, stage and contact line. */
export const LeadHeader = ({ lead }) => (
  <div className="flex items-center gap-4 min-w-0">
    <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-on-accent text-base font-semibold shadow-glow shrink-0">
      {lead?.leadName?.charAt(0)?.toUpperCase() || 'L'}
    </span>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg font-semibold text-fg truncate">{lead?.leadName || 'Lead'}</span>
        {lead && <StatusTag status={lead.stage} />}
      </div>
      <p className="text-sm text-muted truncate">
        {[lead?.companyName || (lead && 'Individual'), lead?.email, lead?.phone].filter(Boolean).join(' · ')}
      </p>
    </div>
  </div>
);

/** Value, source, stage picker and the convert action, under the title. */
export const LeadStageBar = ({ lead, handleStageChange, handleConvertToClient, convertToClientMutation }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-3 border-b border-line bg-sunken/40">
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Badge tone="accent">Est. {inr(lead.estimatedValue)}</Badge>
      <span className="text-muted">Source: {SOURCES[lead.source] || lead.source || SOURCES.DIRECT}</span>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:ml-auto">
      <div className="w-full sm:w-40 shrink-0">
        <Select
          aria-label="Pipeline stage"
          value={lead.stage}
          onChange={(e) => handleStageChange(e.target.value)}
          options={STAGES}
          className="h-9"
        />
      </div>
      {lead.stage !== 'WON' ? (
        <Button variant="primary" icon={Zap} loading={convertToClientMutation.isPending} onClick={handleConvertToClient} className="w-full sm:w-auto">
          Convert to client
        </Button>
      ) : (
        <Badge tone="success" className="h-9 px-3 justify-center">
          <CircleCheckBig className="w-4 h-4" aria-hidden="true" /> Converted to client
        </Badge>
      )}
    </div>
  </div>
);
