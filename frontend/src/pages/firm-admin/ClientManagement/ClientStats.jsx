import React from 'react';
import { Briefcase, DollarSign, Layers, Shield } from 'lucide-react';
import { StatsCard } from '../../../components/common/StatsCard';

export const ClientStats = ({ totalRecords, clients, totalSubscribedServices, totalOutstandingBalance }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    <StatsCard
      title="Total Clients"
      value={totalRecords || clients.length}
      icon={Briefcase}
      color="indigo"
    />
    <StatsCard
      title="Corporate Accounts"
      value={clients.filter((c) => c.clientType !== 'INDIVIDUAL').length}
      icon={Shield}
      color="purple"
    />
    <StatsCard
      title="Subscribed Services"
      value={totalSubscribedServices}
      icon={Layers}
      color="emerald"
    />
    <StatsCard
      title="Total Outstanding Fees"
      value={`₹${totalOutstandingBalance.toLocaleString()}`}
      icon={DollarSign}
      color="rose"
    />
  </div>
);
