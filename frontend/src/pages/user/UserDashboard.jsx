import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { NoticeBanner } from '../../components/announcements/NoticeBanner';
import { AttendanceWidget } from '../../components/attendance/AttendanceWidget';
import { userService } from '../../services/userService';
import { dashboardKeys } from '../../queries/keys';
import { useUpdateTaskStatus } from '../../queries/useTasks';
import { Briefcase, CircleCheckBig, Clock, SquareCheckBig } from 'lucide-react';
import toast from 'react-hot-toast';

export const UserDashboard = () => {
  const { data: dashboardRes, error } = useQuery({
    queryKey: dashboardKeys.byRole('user'),
    queryFn: () => userService.getDashboard(),
  });
  const data = dashboardRes?.data || dashboardRes;

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
    <div className="space-y-8">
      {/* High Priority Unread Notice Alert Banner */}
      <NoticeBanner />

      <PageHeader
        title="Employee Dashboard"
        subtitle="Track your assigned clients, audit tasks, time logs, and compliance items"
      />

      {/* Main Grid: Stats + Attendance Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Stats Cards Column (2/3 width) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <StatsCard
            title="Assigned Clients"
            value={data?.metrics?.assignedClients || 8}
            icon={Briefcase}
            color="indigo"
          />
          <StatsCard
            title="Pending Tasks"
            value={data?.metrics?.pendingTasks || 5}
            icon={SquareCheckBig}
            color="amber"
          />
          <StatsCard
            title="Completed Tasks"
            value={data?.metrics?.completedTasks || 18}
            icon={CircleCheckBig}
            color="emerald"
          />
          <StatsCard
            title="Today's Time Logged"
            value={data?.metrics?.todayTime || '6h 30m'}
            icon={Clock}
            color="blue"
          />
        </div>

        {/* Attendance Widget Column (1/3 width) */}
        <div className="lg:col-span-1">
          <AttendanceWidget />
        </div>
      </div>

      {/* Kanban Board Preview */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100">My Task Kanban Board</h3>
        <KanbanBoard
          tasks={data?.tasks || []}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};
