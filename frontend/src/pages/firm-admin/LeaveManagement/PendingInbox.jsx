import React from 'react';
import { CalendarDays, Check, CheckCheck, X } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { CardSkeleton } from '../../../components/common/Skeleton';
import { EmptyState } from '../../../components/common/EmptyState';
import { Badge, Button, Input } from '../../../components/ui';
import { leaveTypeLabel, dateRange, daysLabel } from './leaveFormat';

const RequestCard = ({ p, adminRemarks, setAdminRemarks, handleAdminReview }) => {
  const name = `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim() || 'Staff user';
  return (
    <article className="rounded-2xl border border-line bg-surface shadow-card p-5 space-y-4">
      <div className="flex items-start gap-3">
        <Avatar firstName={p.user?.firstName} lastName={p.user?.lastName} size="md" className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-fg truncate">{name}</p>
          <p className="text-xs text-subtle truncate">{p.user?.designation || 'Staff Auditor'}</p>
        </div>
        <Badge tone="accent">{leaveTypeLabel(p.leaveType)}</Badge>
      </div>

      <div className="space-y-1.5">
        <p className="flex items-center gap-1.5 text-sm font-medium text-fg">
          <CalendarDays className="w-4 h-4 text-subtle" aria-hidden="true" />
          {dateRange(p.startDate, p.endDate)}
          <span className="text-muted font-normal">· {daysLabel(p.totalDays)}</span>
        </p>
        {p.reason && <p className="text-sm text-muted">{p.reason}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          aria-label={`Remarks for ${name}`}
          placeholder="Remarks (optional)"
          value={adminRemarks[p.id] || ''}
          onChange={(e) => setAdminRemarks({ ...adminRemarks, [p.id]: e.target.value })}
          className="h-9"
        />
        <div className="grid grid-cols-2 sm:flex gap-2 shrink-0">
          <Button size="sm" variant="danger" icon={X} onClick={() => handleAdminReview(p.id, 'REJECTED')} className="h-9">
            Reject
          </Button>
          <Button size="sm" variant="primary" icon={Check} onClick={() => handleAdminReview(p.id, 'APPROVED')} className="h-9">
            Approve
          </Button>
        </div>
      </div>
    </article>
  );
};

export const PendingInbox = ({ pendingRequests, adminRemarks, setAdminRemarks, handleAdminReview, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface">
        <EmptyState icon={CheckCheck} title="All caught up" description="No leave requests are waiting for review." />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {pendingRequests.map((p) => (
        <RequestCard key={p.id} p={p} adminRemarks={adminRemarks} setAdminRemarks={setAdminRemarks} handleAdminReview={handleAdminReview} />
      ))}
    </div>
  );
};
