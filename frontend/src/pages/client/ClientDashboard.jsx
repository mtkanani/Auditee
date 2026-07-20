import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Avatar } from '../../components/common/Avatar';
import { clientService } from '../../services/clientService';
import { FiFileText, FiClock, FiCheckCircle, FiUser, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ClientDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [assignedUser, setAssignedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, myUserRes] = await Promise.all([
          clientService.getDashboard(),
          clientService.getMyUser().catch(() => null),
        ]);
        setData(dashRes.data || dashRes);
        if (myUserRes?.data || myUserRes?.user) {
          setAssignedUser(myUserRes.data || myUserRes.user);
        }
      } catch (error) {
        toast.error('Failed to load client dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Client Portal Dashboard"
        subtitle="Manage your audit requests, GST filings, and communicate with your assigned CA staff"
        actions={
          <button
            onClick={() => navigate('/client/work-requests')}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Work Request</span>
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Total Requests" value={data?.metrics?.totalRequests || 12} icon={FiFileText} color="indigo" />
        <StatsCard title="Pending Requests" value={data?.metrics?.pendingRequests || 3} icon={FiClock} color="amber" />
        <StatsCard title="Completed Items" value={data?.metrics?.completedRequests || 9} icon={FiCheckCircle} color="emerald" />
        <StatsCard title="Active Services" value="Tax & Audit" icon={FiCheckCircle} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned CA Staff Card */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Assigned CA Staff
          </h3>
          {assignedUser ? (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <Avatar firstName={assignedUser.firstName} lastName={assignedUser.lastName} size="md" />
              <div>
                <h4 className="font-bold text-slate-100">{assignedUser.firstName} {assignedUser.lastName}</h4>
                <p className="text-xs text-slate-400">{assignedUser.email}</p>
                <span className="text-[10px] text-indigo-400 font-semibold">{assignedUser.designation || 'Senior CA Staff'}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/60 text-center text-xs text-slate-400 border border-slate-800">
              CA Staff assigned automatically upon service request.
            </div>
          )}
        </div>

        {/* Recent Work Requests Timeline */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">Work Requests Status</h3>
            <button
              onClick={() => navigate('/client/tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View All Tasks →
            </button>
          </div>

          <div className="space-y-3">
            {(data?.requests || []).map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{req.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{req.description || 'No description'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <PriorityBadge priority={req.priority} />
                  <StatusBadge status={req.status} />
                </div>
              </div>
            ))}

            {(!data?.requests || data.requests.length === 0) && (
              <p className="text-xs text-slate-500 text-center py-6">No recent work requests.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
