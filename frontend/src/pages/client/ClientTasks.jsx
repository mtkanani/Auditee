import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { clientService } from '../../services/clientService';
import toast from 'react-hot-toast';

export const ClientTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await clientService.getTasks();
        setTasks(res.data || res.tasks || []);
      } catch (error) {
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const columns = [
    {
      header: 'Request Title',
      key: 'title',
      render: (r) => (
        <div>
          <p className="font-bold text-slate-100">{r.title}</p>
          <p className="text-xs text-slate-400">{r.description || 'No notes'}</p>
        </div>
      ),
    },
    { header: 'Priority', key: 'priority', render: (r) => <PriorityBadge priority={r.priority} /> },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Created Date', key: 'createdAt', render: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Work Requests & Audit Progress"
        subtitle="Track real-time status of GST filings, tax returns, and audit deliverables"
      />

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <DataTable columns={columns} data={tasks} isLoading={isLoading} />
      </div>
    </div>
  );
};
