import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlarmClock, Briefcase, CalendarCheck, MapPin, Plus, Receipt, RefreshCw, SquareCheckBig, TrendingUp, UserPlus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ConfigureGeofenceModal } from '../../../components/attendance/ConfigureGeofenceModal';
import { Button } from '../../../components/ui';
import { QuickActions } from '../../../components/dashboard/QuickActions';
import { useFirmHome } from '../../../queries/useFirms';
import { HomeSkeleton } from './HomeSkeleton';
import { HomeHero } from './HomeHero';
import { KpiTiles } from './KpiTiles';
import { FocusTimeline } from './FocusTimeline';
import { FeesCollected, WorkByStatus } from './WorkAndFees';
import { NewOnTeam, TeamToday } from './TeamToday';
import { Insights } from './Insights';
import { daysUntil, plural } from './format';

const QUICK_ACTIONS = [
  { label: 'New task', hint: 'Assign work to the team', icon: SquareCheckBig, to: '/firm-admin/tasks', state: { openCreate: true } },
  { label: 'New client', hint: 'Add a client record', icon: Briefcase, to: '/firm-admin/clients', state: { openCreate: true } },
  { label: 'New invoice', hint: 'Bill a client', icon: Receipt, to: '/firm-admin/billing', state: { openCreate: true } },
  { label: 'New lead', hint: 'Track a prospect', icon: TrendingUp, to: '/firm-admin/leads', state: { openCreate: true } },
  { label: 'People', hint: 'Add or manage employees', icon: UserPlus, to: '/firm-admin/users' },
  { label: 'Attendance', hint: "See who's in today", icon: CalendarCheck, to: '/firm-admin/attendance' },
];

/** Firm admin home: today's numbers, deadlines and team, from one request (GET /firm-admin/home). */
export const FirmAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGeofenceModalOpen, setIsGeofenceModalOpen] = useState(false);
  const { data, isLoading, isError, isFetching, refetch } = useFirmHome();

  useEffect(() => {
    if (isError) toast.error('Could not load your home page. Try again in a moment.');
  }, [isError]);

  if (isLoading || !data) {
    return isError ? (
      <div className="rounded-2xl border border-line bg-surface p-10 text-center space-y-3">
        <p className="text-sm text-muted">We couldn't load today's overview.</p>
        <Button icon={RefreshCw} onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    ) : (
      <HomeSkeleton />
    );
  }

  const { metrics, invoices, compliance, dueTasks, leave, attendance } = data;
  const done = metrics.completedTasks;
  const total = metrics.pendingTasks + metrics.inProgressTasks + metrics.underReviewTasks + done;
  const overdue = [...compliance, ...dueTasks].filter((i) => daysUntil(i.dueDate) < 0).length;
  const dueSoon = compliance.length + dueTasks.length - overdue;

  const chips = [
    overdue ? { label: `${overdue} overdue`, tone: 'danger', icon: AlarmClock } : null,
    { label: `${dueSoon} due this week`, tone: dueSoon ? 'warning' : 'success', icon: CalendarCheck },
    leave.pendingCount ? { label: `${plural(leave.pendingCount, 'leave request')} waiting`, tone: 'accent' } : null,
    invoices.overdueCount ? { label: plural(invoices.overdueCount, 'overdue invoice'), tone: 'danger', icon: Receipt } : null,
  ].filter(Boolean);

  const inToday = `${attendance.checkedIn} of ${plural(attendance.team, 'team member')} checked in`;
  const summary =
    overdue || dueSoon
      ? `${plural(overdue + dueSoon, 'deadline')} ${overdue + dueSoon === 1 ? 'needs' : 'need'} attention this week · ${inToday}.`
      : `Nothing is due this week · ${inToday}.`;

  return (
    <div className="space-y-6 pb-8">
      <HomeHero
        firstName={user?.firstName}
        summary={summary}
        chips={chips}
        done={done}
        total={total}
        actions={
          <>
            <Button size="sm" variant="primary" icon={Plus} onClick={() => navigate('/firm-admin/tasks', { state: { openCreate: true } })}>
              New task
            </Button>
            <Button size="sm" icon={Receipt} onClick={() => navigate('/firm-admin/billing', { state: { openCreate: true } })}>
              New invoice
            </Button>
            <Button size="sm" variant="ghost" icon={MapPin} onClick={() => setIsGeofenceModalOpen(true)}>
              Office geofence
            </Button>
            {isFetching && <span className="self-center text-xs text-subtle" aria-live="polite">Updating…</span>}
          </>
        }
      />

      <KpiTiles metrics={metrics} invoices={invoices} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start" style={{ '--i': 5 }}>
        <div className="xl:col-span-2">
          <FocusTimeline compliance={compliance} dueTasks={dueTasks} overdueInvoices={invoices.overdueCount} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
          <WorkByStatus metrics={metrics} i={6} />
          <FeesCollected invoices={invoices} i={7} />
        </div>
      </div>

      <Insights />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start" style={{ '--i': 8 }}>
        <div className="xl:col-span-2">
          <div className="rise">
            <QuickActions actions={QUICK_ACTIONS} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
          <TeamToday attendance={attendance} leave={leave} />
          <NewOnTeam people={data.recentUsers} />
        </div>
      </div>

      <ConfigureGeofenceModal isOpen={isGeofenceModalOpen} onClose={() => setIsGeofenceModalOpen(false)} />
    </div>
  );
};
