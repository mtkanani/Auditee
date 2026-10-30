import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlarmClock, ArrowRight, Briefcase, CalendarDays, CalendarPlus, CircleCheckBig, FolderOpen, ListTodo, SquareCheckBig, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { NoticeBanner } from '../../components/announcements/NoticeBanner';
import { AttendanceWidget } from '../../components/attendance/AttendanceWidget';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { Button, Card, StatCard } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { DashboardHero } from '../../components/dashboard/DashboardHero';
import { greeting, taskSegments, upNext } from '../../components/dashboard/dashboardData';
import { ProgressRing } from '../../components/dashboard/ProgressRing';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { StatusBar } from '../../components/dashboard/StatusBar';
import { TaskList } from '../../components/dashboard/TaskList';
import { userService } from '../../services/userService';
import { dashboardKeys } from '../../queries/keys';
import { useMyTasks } from '../../queries/useTasks';
import { daysUntil } from '../../utils/dueDate';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

const QUICK_ACTIONS = [
  { label: 'Apply for leave', hint: 'Send a request to your firm', icon: CalendarPlus, to: '/user/leaves', state: { openApplyModal: true } },
  { label: 'My tasks', hint: 'Board and list views', icon: SquareCheckBig, to: '/user/tasks' },
  { label: 'Meetings', hint: 'Upcoming calls', icon: Video, to: '/user/meetings' },
  { label: 'Documents', hint: 'Your document vault', icon: FolderOpen, to: '/user/document-vault' },
];

export const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openTaskId, setOpenTaskId] = useState(null);

  const { data: dashboardRes, error, isLoading } = useQuery({
    queryKey: dashboardKeys.byRole('user'),
    queryFn: () => userService.getDashboard(),
  });
  // Same query (and cache) as the My tasks page.
  const { tasks, isLoading: tasksLoading } = useMyTasks({});

  useEffect(() => {
    if (error) toast.error('Failed to load employee dashboard');
  }, [error]);

  const data = dashboardRes?.data || dashboardRes || {};
  const summary = data.tasksSummary || {};
  const openCount = (summary.pendingTasks || 0) + (summary.inProgressTasks || 0);
  const openTasks = tasks.filter((t) => t.status !== 'COMPLETED' && t.dueDate);
  const overdue = openTasks.filter((t) => daysUntil(t.dueDate) < 0).length;
  const dueThisWeek = openTasks.filter((t) => daysUntil(t.dueDate) >= 0 && daysUntil(t.dueDate) <= 7).length;
  const show = (v) => (isLoading ? '…' : v ?? 0);

  const highlights = tasksLoading
    ? []
    : [
        overdue ? { label: `${plural(overdue, 'task')} overdue`, tone: 'danger', icon: AlarmClock } : null,
        { label: `${dueThisWeek} due this week`, tone: dueThisWeek ? 'warning' : 'success', icon: CalendarDays },
      ].filter(Boolean);

  return (
    <div className="space-y-6 pb-8">
      <NoticeBanner />

      <DashboardHero
        title={`${greeting()}${user?.firstName ? `, ${user.firstName}` : ''}`}
        description={isLoading ? 'Getting your day ready…' : `You have ${plural(openCount, 'open task')} across ${plural(data.assignedClientsCount || 0, 'client')}.`}
        highlights={highlights}
        actions={
          <>
            <Button size="sm" variant="primary" iconRight={ArrowRight} onClick={() => navigate('/user/tasks')}>
              Open my tasks
            </Button>
            <Button size="sm" icon={CalendarPlus} onClick={() => navigate('/user/leaves', { state: { openApplyModal: true } })}>
              Apply for leave
            </Button>
          </>
        }
        aside={
          <ProgressRing
            value={summary.completedTasks || 0}
            total={summary.totalTasks || 0}
            label="completed"
            caption={isLoading ? undefined : `${summary.completedTasks || 0} of ${summary.totalTasks || 0} tasks done`}
          />
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="My clients" value={show(data.assignedClientsCount)} icon={Briefcase} onClick={() => navigate('/user/clients')} />
        <StatCard label="Open tasks" value={show(openCount)} icon={ListTodo} tone="warning" hint={isLoading ? undefined : `${summary.inProgressTasks || 0} in progress`} onClick={() => navigate('/user/tasks')} />
        <StatCard label="Due this week" value={tasksLoading ? '…' : dueThisWeek} icon={CalendarDays} tone={overdue ? 'danger' : 'accent'} hint={overdue ? `${overdue} overdue` : 'nothing overdue'} />
        <StatCard label="Completed" value={show(summary.completedTasks)} icon={CircleCheckBig} tone="success" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <Card
          title="Up next"
          description="Your open tasks, nearest due date first"
          padded={false}
          className="xl:col-span-2"
          actions={
            <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/user/tasks')}>
              All tasks
            </Button>
          }
        >
          <TaskList
            tasks={upNext(tasks)}
            isLoading={tasksLoading}
            subtitle={(t) => t.client?.companyName || t.client?.clientName || 'Firm task'}
            onOpen={(t) => setOpenTaskId(t.id)}
            emptyTitle="Nothing open"
            emptyText="New work your firm assigns to you will show up here."
          />
        </Card>
        <AttendanceWidget />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <Card title="My work by status" description={isLoading ? 'Loading…' : plural(openCount + (summary.completedTasks || 0), 'task')}>
          <StatusBar
            segments={taskSegments({ pending: summary.pendingTasks, inProgress: summary.inProgressTasks, completed: summary.completedTasks })}
            isLoading={isLoading}
            emptyText="No tasks assigned yet."
          />
        </Card>
        <div className="xl:col-span-2">
          <QuickActions actions={QUICK_ACTIONS} />
        </div>
      </div>

      <TaskDetailModal taskId={openTaskId} isOpen={Boolean(openTaskId)} onClose={() => setOpenTaskId(null)} />
    </div>
  );
};
