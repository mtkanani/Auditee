import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, Select } from '../../../components/ui';
import { stageOptions, inr } from './pipelineStages';

// Inline controls shouldn't also trigger the row's "open lead" click.
const stop = (e) => e.stopPropagation();

export const getLeadColumns = ({ setSelectedLeadId, setIsDetailModalOpen, handleStageUpdate }) => [
  {
    key: 'leadName',
    header: 'Lead',
    render: (r) => (
      <div className="min-w-0">
        <p className="font-medium text-fg truncate max-w-[260px]">{r.leadName}</p>
        <p className="text-xs text-subtle truncate max-w-[260px]">{[r.companyName || 'Individual', r.email].filter(Boolean).join(' · ')}</p>
      </div>
    ),
  },
  { key: 'phone', header: 'Phone', render: (r) => <span className="text-muted tabular-nums">{r.phone || '—'}</span> },
  {
    key: 'interestedServices',
    header: 'Interested in',
    render: (r) => <span className="text-muted line-clamp-1 max-w-[240px]">{r.interestedServices || 'General CA Audit'}</span>,
  },
  {
    key: 'estimatedValue',
    header: 'Value',
    align: 'right',
    render: (r) => <span className="font-medium text-fg tabular-nums">{inr(r.estimatedValue)}</span>,
  },
  {
    key: 'stage',
    header: 'Stage',
    render: (r) => (
      <div className="w-40" onClick={stop}>
        <Select
          aria-label={`Stage of ${r.leadName}`}
          value={r.stage}
          onChange={(e) => handleStageUpdate(r.id, e.target.value)}
          options={stageOptions}
          className="h-8 text-xs"
        />
      </div>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (r) => (
      <Button
        size="sm"
        variant="soft"
        iconRight={ArrowRight}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedLeadId(r.id);
          setIsDetailModalOpen(true);
        }}
      >
        Open
      </Button>
    ),
  },
];
