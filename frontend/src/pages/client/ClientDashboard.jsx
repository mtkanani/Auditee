import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleCheckBig, Clock, FileText, Plus, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, PageHeader, StatCard, StatusTag } from '../../components/ui';
import { Avatar } from '../../components/common/Avatar';
import { EmptyState } from '../../components/common/EmptyState';
import { PriorityBadge } from '../../components/tasks/PriorityBadge';
import { NoticeBanner } from '../../components/announcements/NoticeBanner';
import { clientService } from '../../services/clientService';
import { dashboardKeys } from '../../queries/keys';

const linkClass =
  'inline-flex items-center gap-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';

export const ClientDashboard = () => {
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

  const data = dashResult?.dashboard;
  const assignedUser = dashResult?.assignedUser;
  const metrics = data?.metrics || {};
  const requests = data?.requests || [];
  const show = (v) => (isLoading ? '…' : v ?? 0);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load client dashboard');
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Your requests, their progress and the person looking after you."
        actions={
          <Link to="/client/work-requests" className={`${linkClass} h-9 px-4 bg-accent text-on-accent hover:bg-accent-hover`}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            New request
          </Link>
        }
      />

      <NoticeBanner />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="All requests" value={show(metrics.totalRequests)} icon={FileText} tone="accent" />
        <StatCard label="In progress" value={show(metrics.pendingRequests)} icon={Clock} tone="warning" />
        <StatCard label="Completed" value={show(metrics.completedRequests)} icon={CircleCheckBig} tone="success" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card title="Your contact at the firm">
          {assignedUser ? (
            <div className="flex items-center gap-3 min-w-0">
              <Avatar firstName={assignedUser.firstName} lastName={assignedUser.lastName} size="md" />
              <div className="min-w-0">
                <p className="font-medium text-fg truncate">
                  {assignedUser.firstName} {assignedUser.lastName}
                </p>
                {assignedUser.email && (
                  <a href={`mailto:${assignedUser.email}`} className="block text-sm text-accent-fg hover:underline truncate">
                    {assignedUser.email}
                  </a>
                )}
                {assignedUser.designation && <p className="text-xs text-muted mt-0.5">{assignedUser.designation}</p>}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-sm text-muted">
              <UserRound className="w-5 h-5 text-subtle shrink-0" aria-hidden="true" />
              <p>Your firm will assign someone to you when work starts on your first request.</p>
            </div>
          )}
        </Card>

        <Card
          title="Recent requests"
          padded={false}
          className="xl:col-span-2"
          actions={
            <Link to="/client/tasks" className={`${linkClass} text-accent-fg hover:underline`}>
              View all <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          }
        >
          {requests.length === 0 ? (
            <EmptyState icon={FileText} title="No requests yet" description="Requests you send to your firm will show up here." />
          ) : (
            <ul className="divide-y divide-line border-t border-line">
              {requests.map((req) => (
                <li key={req.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-fg text-sm truncate">{req.title}</p>
                    {req.description && <p className="text-xs text-muted mt-0.5 line-clamp-1">{req.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={req.priority} />
                    {req.status && <StatusTag status={String(req.status).toUpperCase()} />}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};
