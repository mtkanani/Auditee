import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { NoticeBanner } from '../../components/announcements/NoticeBanner';
import { AttendanceWidget } from '../../components/attendance/AttendanceWidget';
import { PageHeader, StatCard } from '../../components/ui';
import { userService } from '../../services/userService';
import { dashboardKeys } from '../../queries/keys';
import { useUpdateTaskStatus } from '../../queries/useTasks';
import { ArrowRight, Briefcase, CircleCheckBig, Clock, SquareCheckBig } from 'lucide-react';
import toast from 'react-hot-toast';

export const UserDashboard = () => {
  const { data: dashboardRes, error, isLoading } = useQuery({
    queryKey: dashboardKeys.byRole('user'),
    queryFn: () => userService.getDashboard(),
  });
  const data = dashboardRes?.data || dashboardRes;
  const metrics = data?.metrics || {};
  const show = (v) => (isLoading ? '…' : v ?? 0);

  const updateStatusMutation = useUpdateTaskStatus({ scope: 'user' });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load employee dashboard');
    }
  }, [error]);

  const handleStatusChange = (taskId, newStatus) => {
    updateStatusMutation.mutate({ taskId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <NoticeBanner />

      <PageHeader title="My day" description="Your clients, open tasks, time logged and attendance in one place." />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 grid grid-cols-2 gap-4">
          <StatCard label="Assigned clients" value={show(metrics.assignedClients)} icon={Briefcase} tone="accent" />
          <StatCard label="Pending tasks" value={show(metrics.pendingTasks)} icon={SquareCheckBig} tone="warning" />
          <StatCard label="Completed tasks" value={show(metrics.completedTasks)} icon={CircleCheckBig} tone="success" />
          <StatCard label="Time logged today" value={isLoading ? '…' : metrics.todayTime || '0h'} icon={Clock} tone="neutral" />
        </div>
        <AttendanceWidget />
      </div>

      <section className="space-y-3" aria-labelledby="my-board">
        <div className="flex items-center justify-between gap-3">
          <h2 id="my-board" className="text-base font-semibold text-fg">My task board</h2>
          <Link to="/user/tasks" className="inline-flex items-center gap-1 text-sm font-medium text-accent-fg hover:underline">
            All tasks <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <KanbanBoard tasks={data?.tasks || []} onStatusChange={handleStatusChange} />
      </section>
    </div>
  );
};
