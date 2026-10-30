import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, Card } from '../../../components/ui';
import { StatusBar } from '../../../components/dashboard/StatusBar';
import { taskSegments } from '../../../components/dashboard/dashboardData';
import { inrShort } from './dates';

/** Where the firm's work stands, by task status. */
export const TaskBreakdown = ({ metrics, isLoading }) => {
  const navigate = useNavigate();
  const segments = taskSegments({
    pending: metrics.pendingTasks || 0,
    inProgress: metrics.inProgressTasks || 0,
    completed: metrics.completedTasks || 0,
  });
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card
      title="Work by status"
      description={isLoading ? 'Loading…' : `${total} task${total === 1 ? '' : 's'} across the firm`}
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/tasks')}>
          Tasks
        </Button>
      }
    >
      <StatusBar segments={segments} isLoading={isLoading} emptyText="No tasks yet. Create one to get started." />
    </Card>
  );
};

const Figure = ({ label, value, tone }) => (
  <div className="min-w-0">
    <dt className="text-xs text-muted">{label}</dt>
    <dd className={`mt-0.5 text-lg font-semibold tabular-nums truncate ${tone || 'text-fg'}`}>{value}</dd>
  </div>
);

/** Billed vs collected, from the invoice totals (all invoices, not just one page). */
export const FeesCollection = ({ invoiceSummary }) => {
  const navigate = useNavigate();
  const billed = Number(invoiceSummary.totalAmount || 0);
  const paid = Number(invoiceSummary.paidAmount || 0);
  const due = Number(invoiceSummary.balanceAmount || 0);
  const loaded = invoiceSummary.totalAmount !== undefined;
  const rate = billed > 0 ? Math.round((paid / billed) * 100) : null;

  return (
    <Card
      title="Fees collected"
      description={!loaded ? 'Loading…' : rate === null ? 'No invoices yet' : `${rate}% of everything billed`}
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/billing')}>
          Billing
        </Button>
      }
    >
      <div
        className="h-3 rounded-full bg-sunken overflow-hidden"
        role="img"
        aria-label={rate === null ? 'No invoices yet' : `${rate}% of billed fees collected`}
      >
        {rate > 0 && <div className="h-full rounded-full bg-[var(--chart-done)] transition-[width] duration-700" style={{ width: `${rate}%` }} />}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3">
        <Figure label="Billed" value={loaded ? inrShort(billed) : '—'} />
        <Figure label="Collected" value={loaded ? inrShort(paid) : '—'} />
        <Figure label="Outstanding" value={loaded ? inrShort(due) : '—'} tone={due > 0 ? 'text-danger' : undefined} />
      </dl>
    </Card>
  );
};
