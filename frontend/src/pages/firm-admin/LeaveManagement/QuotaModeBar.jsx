import React from 'react';
import { Tabs } from '../../../components/ui';

/** Heading for the balance cards, with the per-year / per-month switch. */
export const QuotaModeBar = ({ displayQuotaMode, setDisplayQuotaMode, myLeaveData }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-sm font-semibold text-fg">Leave balance</h2>
      {myLeaveData.policy && (
        <p className="text-xs text-subtle">Firm policy: {myLeaveData.policy.accrualMode?.toLowerCase()} accrual</p>
      )}
    </div>
    <Tabs
      aria-label="Show balances"
      value={displayQuotaMode}
      onChange={setDisplayQuotaMode}
      items={[
        { value: 'YEARLY', label: 'Per year' },
        { value: 'MONTHLY', label: 'Per month' },
      ]}
    />
  </div>
);
