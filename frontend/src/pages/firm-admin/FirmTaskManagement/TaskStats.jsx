import React from 'react';
import { CircleCheckBig, Clock, Inbox, Layers } from 'lucide-react';
import { StatCard } from '../../../components/ui';

export const TaskStats = ({ totalRecords, inProgressCount, completedCount, clientRequests, setActiveTab }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
    <StatCard label="Total tasks" value={totalRecords} icon={Layers} />
    <StatCard label="In progress" value={inProgressCount} icon={Clock} tone="warning" hint="on this page" />
    <StatCard label="Completed" value={completedCount} icon={CircleCheckBig} tone="success" hint="on this page" />
    <StatCard
      label="Client requests"
      value={clientRequests.length}
      icon={Inbox}
      tone={clientRequests.length ? 'danger' : 'neutral'}
      hint={clientRequests.length ? 'waiting for you' : 'none waiting'}
      onClick={() => setActiveTab('requests')}
    />
  </div>
);
