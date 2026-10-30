import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CircleCheckBig, CreditCard, FileText, FolderUp, IndianRupee, ListTodo, Mail, Plus, Receipt, UserRound, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Card, StatCard } from '../../components/ui';
import { Avatar } from '../../components/common/Avatar';
import { NoticeBanner } from '../../components/announcements/NoticeBanner';
import { DashboardHero } from '../../components/dashboard/DashboardHero';
import { greeting } from '../../components/dashboard/dashboardData';
import { ProgressRing } from '../../components/dashboard/ProgressRing';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { TaskList } from '../../components/dashboard/TaskList';
import { useAuth } from '../../context/AuthContext';
import { clientService } from '../../services/clientService';
import { dashboardKeys } from '../../queries/keys';
import { useClientInvoices } from '../../queries/useInvoices';
import { inr } from '../firm-admin/BillingManagement/format';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

const QUICK_ACTIONS = [
  { label: 'New request', hint: 'Ask your firm for work', icon: Plus, to: '/client/work-requests' },
  { label: 'Share documents', hint: 'Upload to your vault', icon: FolderUp, to: '/client/document-vault' },
  { label: 'Invoices', hint: 'View and pay', icon: Receipt, to: '/client/billing' },
  { label: 'Meetings', hint: 'Calls with your firm', icon: Video, to: '/client/meetings' },
];

const ContactCard = ({ person, isLoading }) => (
  <Card title="Your contact at the firm">
    {isLoading ? (
      <div className="h-12 rounded-xl bg-hover animate-pulse" />
    ) : person ? (
      <div className="flex items-center gap-3 min-w-0">
        <Avatar firstName={person.firstName} lastName={person.lastName} size="md" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-fg truncate">
            {person.firstName} {person.lastName}
          </p>
          {person.designation && <p className="text-xs text-muted truncate">{person.designation}</p>}
        </div>
        {person.email && (
          <a
            href={`mailto:${person.email}`}
            aria-label={`Email ${person.firstName}`}
            className="grid place-items-center w-9 h-9 rounded-xl bg-accent-soft text-accent-fg hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
          </a>
        )}
      </div>
    ) : (
      <div className="flex items-start gap-3 text-sm text-muted">
        <UserRound className="w-5 h-5 text-subtle shrink-0" aria-hidden="true" />
        <p>Your firm will assign someone to you when work starts on your first request.</p>
      </div>
    )}
  </Card>
);

export const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dashResult, error, isLoading } = useQuery({
    queryKey: dashboardKeys.byRole('client'),
    queryFn: async () => {
      const [dashRes, myUserRes] = await Promise.all([
        clientService.getDashboard(),
        clientService.getMyUser().catch(() => null),
      ]);
      return {
        dashboard: dashRes.data || dashRes,
        assignedUser: myUserRes?.data || myUserRes?.user || null,
      };
    },
  });
  // limit 1: only the totals in summary are needed here.
  const { summary: invoiceSummary, isLoading: invoicesLoading } = useClientInvoices({ page: 1, limit: 1 });

  useEffect(() => {
    if (error) toast.error('Failed to load client dashboard');
  }, [error]);

  const data = dashResult?.dashboard || {};
  const summary = data.tasksSummary || {};
  const active = (summary.pendingTasks || 0) + (summary.inProgressTasks || 0);
  const outstanding = Number(invoiceSummary?.balanceAmount || 0);
  const toPay = invoiceSummary?.pendingCount || 0;
  const name = user?.clientName?.split(' ')[0] || user?.firstName;
  const show = (v) => (isLoading ? '…' : v ?? 0);

  const highlights = [
    !isLoading && { label: `${plural(active, 'request')} in progress`, tone: active ? 'accent' : 'success', icon: ListTodo },
    !invoicesLoading && outstanding > 0 && { label: `${inr(outstanding)} to pay`, tone: 'danger', icon: IndianRupee },
  ].filter(Boolean);

  return (
    <div className="space-y-6 pb-8">
      <NoticeBanner />

      <DashboardHero
        title={`${greeting()}${name ? `, ${name}` : ''}`}
        description="Follow your filings and requests, share documents and pay invoices in one place."
        highlights={highlights}
        actions={
          <>
            <Button size="sm" variant="primary" icon={Plus} onClick={() => navigate('/client/work-requests')}>
              New request
            </Button>
            {outstanding > 0 && (
              <Button size="sm" icon={CreditCard} onClick={() => navigate('/client/billing')}>
                Pay invoices
              </Button>
            )}
          </>
        }
        aside={
          <ProgressRing
            value={summary.completedTasks || 0}
            total={summary.totalTasks || 0}
            label="done"
            caption={isLoading ? undefined : `${summary.completedTasks || 0} of ${plural(summary.totalTasks || 0, 'request')} completed`}
          />
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="All requests" value={show(summary.totalTasks)} icon={FileText} onClick={() => navigate('/client/tasks')} />
        <StatCard label="In progress" value={show(active)} icon={ListTodo} tone="warning" />
        <StatCard label="Completed" value={show(summary.completedTasks)} icon={CircleCheckBig} tone="success" />
        <StatCard
          label="Outstanding"
          value={invoicesLoading ? '…' : inr(outstanding)}
          icon={IndianRupee}
          tone={outstanding > 0 ? 'danger' : 'success'}
          hint={invoicesLoading ? undefined : toPay ? plural(toPay, 'invoice') + ' to pay' : 'all paid'}
          onClick={() => navigate('/client/billing')}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <Card
          title="Recent requests"
          description="The latest work you've asked for"
          padded={false}
          className="xl:col-span-2"
          actions={
            <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/client/tasks')}>
              View all
            </Button>
          }
        >
          <TaskList
            tasks={data.recentTasks || []}
            isLoading={isLoading}
            subtitle={(t) => (t.user ? `With ${t.user.firstName} ${t.user.lastName}` : 'Waiting to be assigned')}
            onOpen={() => navigate('/client/tasks')}
            emptyTitle="No requests yet"
            emptyText="Send your firm a request and you can follow its progress here."
          />
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
          <ContactCard person={dashResult?.assignedUser} isLoading={isLoading} />
          <QuickActions actions={QUICK_ACTIONS} title="Shortcuts" />
        </div>
      </div>
    </div>
  );
};
