import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { NoticeBanner } from '../../components/announcements/NoticeBanner';
import { userService } from '../../services/userService';
import { FiBriefcase, FiCheckSquare, FiClock, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await userService.getDashboard();
      setData(res.data || res);
    } catch (error) {
      toast.error('Failed to load employee dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await userService.updateTaskStatus(taskId, newStatus);
      toast.success('Task status updated!');
      fetchDashboard();
    } catch (error) {
      toast.error(error.message || 'Failed to update task status.');
    }
  };

  return (
    <div className="space-y-8">
      {/* High Priority Unread Notice Alert Banner */}
      <NoticeBanner />

      <PageHeader
        title="Employee Dashboard"
        subtitle="Track your assigned clients, audit tasks, time logs, and compliance items"
      />

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Assigned Clients"
          value={data?.metrics?.assignedClients || 8}
          icon={FiBriefcase}
          color="indigo"
        />
        <StatsCard
          title="Pending Tasks"
          value={data?.metrics?.pendingTasks || 5}
          icon={FiCheckSquare}
          color="amber"
        />
        <StatsCard
          title="Completed Tasks"
          value={data?.metrics?.completedTasks || 18}
          icon={FiCheckCircle}
          color="emerald"
        />
        <StatsCard
          title="Today's Time Logged"
          value={data?.metrics?.todayTime || '6h 30m'}
          icon={FiClock}
          color="blue"
        />
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
