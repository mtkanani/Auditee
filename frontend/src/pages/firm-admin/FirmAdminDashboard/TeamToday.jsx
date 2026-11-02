import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, UserCheck } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { Button, Card } from '../../../components/ui';
import { useReviewLeave } from '../../../queries/useLeave';
import { plural } from './format';

const humanize = (s = '') => s.toLowerCase().replace(/_/g, ' ');
const shortDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

/** Who's checked in today, and leave requests to approve right here. */
export const TeamToday = ({ attendance, leave, sample = false }) => {
  const navigate = useNavigate();
  const review = useReviewLeave();
  const busyId = review.isPending ? review.variables?.id : null;
  // Sample leave requests aren't real, so reviewing them must never reach the server.
  const decide = (id, status) =>
    sample ? toast('Sample data: nothing was changed.') : review.mutate({ id, status, adminRemarks: '' });
  const pct = attendance.team ? Math.round((attendance.checkedIn / attendance.team) * 100) : 0;

  return (
    <Card
      title="Team today"
      description={`${attendance.checkedIn} of ${plural(attendance.team, 'team member')} checked in`}
      padded={false}
      className="rise"
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/attendance')}>
          Attendance
        </Button>
      }
    >
      <div className="px-5 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-success-soft text-success shrink-0">
            <UserCheck className="w-[18px] h-[18px]" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <div className="h-2.5 rounded-full bg-sunken overflow-hidden" role="img" aria-label={`${pct}% of the team checked in`}>
              {pct > 0 && <div className="grow-x h-full rounded-full bg-[var(--chart-done)]" style={{ width: `${pct}%` }} />}
            </div>
          </div>
          <span className="text-sm font-semibold text-fg tabular-nums">{pct}%</span>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <p className="text-sm font-medium text-fg">Leave requests</p>
          <span className="text-xs text-subtle">{leave.pendingCount ? `${leave.pendingCount} waiting` : 'none waiting'}</span>
        </div>
        {leave.pending.length === 0 ? (
          <p className="flex items-center gap-2 px-5 pb-4 pt-1 text-sm text-muted">
            <CalendarDays className="w-4 h-4 text-subtle" aria-hidden="true" />
            New requests will show up here.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {leave.pending.map((r) => (
              <li key={r.id} className="px-5 py-3 space-y-2.5">
                <div className="flex items-start gap-3">
                  <Avatar firstName={r.user?.firstName} lastName={r.user?.lastName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-fg truncate">
                      {r.user?.firstName} {r.user?.lastName}
                    </p>
                    <p className="text-xs text-subtle">
                      <span className="capitalize">{humanize(r.leaveType)}</span> · {shortDate(r.startDate)}–{shortDate(r.endDate)}
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
                    onClick={() => decide(r.id, 'APPROVED')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1"
                    loading={busyId === r.id && review.variables?.status === 'REJECTED'}
                    disabled={busyId === r.id}
                    onClick={() => decide(r.id, 'REJECTED')}
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

/** Most recently added employees. */
export const NewOnTeam = ({ people }) => {
  const navigate = useNavigate();
  if (!people.length) return null;
  return (
    <Card
      title="New on the team"
      padded={false}
      className="rise"
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/users')}>
          People
        </Button>
      }
    >
      <ul className="divide-y divide-line border-t border-line">
        {people.map((u) => (
          <li key={u.id} className="flex items-center gap-3 px-5 py-3">
            <Avatar firstName={u.firstName} lastName={u.lastName} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-fg truncate">
                {u.firstName} {u.lastName}
              </p>
              <p className="text-xs text-subtle truncate">{u.designation || 'Team member'}</p>
            </div>
            <span className="text-xs text-subtle shrink-0">{shortDate(u.createdAt)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
