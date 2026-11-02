import React from 'react';
import { Clock } from 'lucide-react';
import { Card, PageHeader } from '../../components/ui';
import { EmptyState } from '../../components/common/EmptyState';

// There is no endpoint that lists time entries yet, so this page shows an empty state
// instead of sample rows. Wire it to a query hook once GET /user/time-entries exists.
export const TimeEntries = () => (
  <div className="space-y-6">
    <PageHeader title="Time entries" description="Hours you log against tasks, with your work notes." />
    <Card padded={false}>
      <EmptyState
        icon={Clock}
        title="No time logged yet"
        description="Hours you log against your tasks will be listed here, with totals for today and this week."
      />
    </Card>
  </div>
);
