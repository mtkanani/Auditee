import React from 'react';
import { CircleCheckBig, Clock, Inbox, Layers } from 'lucide-react';
import { StatsCard } from '../../../components/common/StatsCard';

export const TaskStats = ({ totalRecords, inProgressCount, completedCount, clientRequests }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    <StatsCard title="Total Tasks" value={totalRecords} icon={Layers} color="indigo" />
    <StatsCard title="In Progress Tasks" value={inProgressCount} icon={Clock} color="purple" />
    <StatsCard title="Completed Tasks" value={completedCount} icon={CircleCheckBig} color="emerald" />
    <StatsCard
      title="Client Work Requests"
      value={clientRequests.length}
      icon={Inbox}
      color="rose"
    />
  </div>
);
