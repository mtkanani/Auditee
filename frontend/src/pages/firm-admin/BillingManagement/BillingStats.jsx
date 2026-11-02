import React from 'react';
import { CircleCheckBig, FileText, IndianRupee, TriangleAlert } from 'lucide-react';
import { StatCard } from '../../../components/ui';
import { inr } from './format';

/** Metrics cover every matching invoice (computed server-side), not just this page. */
export const BillingStats = ({ summary, setStatusFilter }) => {
  const billed = summary?.totalAmount || 0;
  const received = summary?.paidAmount || 0;
  const outstanding = summary?.balanceAmount || 0;
  const overdue = summary?.overdueCount || 0;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <StatCard label="Billed" value={inr(billed)} icon={FileText} />
      <StatCard
        label="Received"
        value={inr(received)}
        icon={CircleCheckBig}
        tone="success"
        hint={billed > 0 ? `${Math.round((received / billed) * 100)}% collected` : undefined}
      />
      <StatCard label="Outstanding" value={inr(outstanding)} icon={IndianRupee} tone={outstanding > 0 ? 'danger' : 'neutral'} />
      <StatCard
        label="Overdue invoices"
        value={overdue}
        icon={TriangleAlert}
        tone={overdue > 0 ? 'warning' : 'neutral'}
        hint="show only these"
        onClick={() => setStatusFilter('OVERDUE')}
      />
    </div>
  );
};
