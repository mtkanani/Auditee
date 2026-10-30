import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { Button, Card } from '../../../components/ui';
import { useReviewLeave } from '../../../queries/useLeave';

const humanize = (s = '') => s.toLowerCase().replace(/_/g, ' ');
const shortDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

/** Pending leave with approve / reject inline. */
export const LeaveApprovals = ({ pendingLeave, loading }) => {
  const navigate = useNavigate();
  const review = useReviewLeave();
  const busyId = review.isPending ? review.variables?.id : null;

  return (
    <Card
      title="Leave requests"
      description={loading ? 'Loading…' : pendingLeave.length ? `${pendingLeave.length} waiting for you` : 'No requests waiting'}
      padded={false}
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/leave-management')}>
          All
        </Button>
      }
    >
      {pendingLeave.length > 0 && (
        <ul className="divide-y divide-line border-t border-line">
          {pendingLeave.slice(0, 4).map((r) => (
            <li key={r.id} className="px-5 py-3 space-y-2.5">
              <div className="flex items-start gap-3">
                <Avatar firstName={r.user?.firstName} lastName={r.user?.lastName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-fg truncate">
                    {r.user?.firstName} {r.user?.lastName}
                  </p>
                  <p className="text-xs text-subtle">
                    <span className="capitalize">{humanize(r.leaveType)}</span> · {shortDate(r.startDate)}–{shortDate(r.endDate)} · {r.totalDays} day{r.totalDays === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pl-11">
                <Button
                  size="sm"
                  variant="soft"
                  className="flex-1"
                  loading={busyId === r.id && review.variables?.status === 'APPROVED'}
                  disabled={busyId === r.id}
                  onClick={() => review.mutate({ id: r.id, status: 'APPROVED', adminRemarks: '' })}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1"
                  loading={busyId === r.id && review.variables?.status === 'REJECTED'}
                  disabled={busyId === r.id}
                  onClick={() => review.mutate({ id: r.id, status: 'REJECTED', adminRemarks: '' })}
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && pendingLeave.length === 0 && (
        <div className="flex items-center gap-3 px-5 py-4 border-t border-line text-sm text-muted">
          <CalendarDays className="w-4 h-4 text-subtle" aria-hidden="true" />
          New requests will show up here.
        </div>
      )}
    </Card>
  );
};

/** Five most recently added employees. */
export const NewTeamMembers = ({ recentUsers }) => {
  const navigate = useNavigate();
  if (recentUsers.length === 0) return null;
  return (
    <Card
      title="New on the team"
      padded={false}
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/users')}>
          People
        </Button>
      }
    >
      <ul className="divide-y divide-line border-t border-line">
        {recentUsers.map((u) => (
          <li key={u.id} className="flex items-center gap-3 px-5 py-3">
            <Avatar firstName={u.firstName} lastName={u.lastName} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-fg truncate">{u.firstName} {u.lastName}</p>
              <p className="text-xs text-subtle truncate">{u.designation || u.email}</p>
            </div>
            <span className="text-xs text-subtle shrink-0">{shortDate(u.createdAt)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
