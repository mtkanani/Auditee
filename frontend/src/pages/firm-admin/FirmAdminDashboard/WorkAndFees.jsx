import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, Card } from '../../../components/ui';
import { StatusBar } from '../../../components/dashboard/StatusBar';
import { taskSegments } from '../../../components/dashboard/dashboardData';
import { inrShort, plural } from './format';

/** Where the firm's work stands, by task status. */
export const WorkByStatus = ({ metrics, i }) => {
  const navigate = useNavigate();
  const segments = taskSegments({
    pending: metrics.pendingTasks,
    inProgress: metrics.inProgressTasks,
    completed: metrics.completedTasks,
  });
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  return (
    <Card
      title="Work by status"
      description={plural(total, 'task')}
      className="rise"
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/tasks')}>
          Tasks
        </Button>
      }
    >
      <div style={{ '--i': i }}>
        <StatusBar segments={segments} emptyText="No tasks yet. Create one to get started." />
      </div>
    </Card>
  );
};

const Figure = ({ label, value, tone }) => (
  <div className="min-w-0">
    <dt className="text-xs text-muted">{label}</dt>
    <dd className={`mt-0.5 text-lg font-semibold tabular-nums truncate ${tone || 'text-fg'}`}>{value}</dd>
  </div>
);

/** Billed vs collected across all invoices. */
export const FeesCollected = ({ invoices, i }) => {
  const navigate = useNavigate();
  const billed = invoices.totalAmount;
  const rate = billed > 0 ? Math.round((invoices.paidAmount / billed) * 100) : null;
  return (
    <Card
      title="Fees collected"
      description={rate === null ? 'No invoices yet' : `${rate}% of everything billed`}
      className="rise"
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/billing')}>
          Billing
        </Button>
      }
    >
      <div className="h-3 rounded-full bg-sunken overflow-hidden" role="img" aria-label={rate === null ? 'No invoices yet' : `${rate}% of billed fees collected`}>
        {rate > 0 && (
          <div className="grow-x h-full rounded-full bg-[var(--chart-done)]" style={{ width: `${rate}%`, '--i': i }} />
        )}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3">
        <Figure label="Billed" value={inrShort(billed)} />
        <Figure label="Collected" value={inrShort(invoices.paidAmount)} />
        <Figure label="Outstanding" value={inrShort(invoices.balanceAmount)} tone={invoices.balanceAmount > 0 ? 'text-danger' : undefined} />
      </dl>
    </Card>
  );
};
