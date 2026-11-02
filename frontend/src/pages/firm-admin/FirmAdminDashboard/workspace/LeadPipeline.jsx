import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button, Card } from '../../../../components/ui';
import { inrShort } from '../format';

const STAGES = { NEW_LEAD: 'New', DISCUSSION: 'In discussion', PROPOSAL_SENT: 'Proposal sent', WON: 'Won' };

/** Prospects by stage as a funnel, with the value still in play and how often deals are won. */
export const LeadPipeline = ({ leads }) => {
  const navigate = useNavigate();
  const max = Math.max(1, ...leads.stages.map((s) => s.count));
  const empty = leads.stages.every((s) => s.count === 0);

  return (
    <Card
      title="Lead pipeline"
      description={empty ? 'Prospects by stage' : `${inrShort(leads.pipelineValue)} in open deals`}
      className="rise h-full"
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/leads')}>
          Leads
        </Button>
      }
    >
      {empty ? (
        <p className="flex items-center gap-2 py-6 text-sm text-muted">
          <TrendingUp className="w-4 h-4 text-subtle" aria-hidden="true" />
          Add a lead to start tracking new business.
        </p>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-2.5">
            {leads.stages.map((s, i) => (
              <li key={s.stage}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted">{STAGES[s.stage] || s.stage}</span>
                  <span className="text-fg tabular-nums">
                    <span className="font-semibold">{s.count}</span>
                    {s.value > 0 && <span className="text-subtle"> · {inrShort(s.value)}</span>}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-sunken overflow-hidden">
                  <div
                    className="grow-x h-full rounded-full"
                    style={{ width: `${Math.max(s.count ? 4 : 0, (s.count / max) * 100)}%`, background: s.stage === 'WON' ? 'var(--chart-done)' : 'var(--chart-progress)', '--i': i }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <dl className="grid grid-cols-3 gap-3 pt-3 border-t border-line">
            <div>
              <dt className="text-xs text-muted">Won this month</dt>
              <dd className="text-sm font-semibold text-success tabular-nums">{leads.wonThisMonth}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Lost this month</dt>
              <dd className="text-sm font-semibold text-fg tabular-nums">{leads.lostThisMonth}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Win rate</dt>
              <dd className="text-sm font-semibold text-fg tabular-nums">{leads.conversion === null ? '–' : `${leads.conversion}%`}</dd>
            </div>
          </dl>
        </div>
      )}
    </Card>
  );
};
