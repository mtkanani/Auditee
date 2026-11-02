import React from 'react';
import { Briefcase, IndianRupee, Layers, Building2 } from 'lucide-react';
import { StatCard } from '../../../components/ui';

/** Total comes from the server; the other three are summed from the clients on this page. */
export const ClientStats = ({ totalRecords, clients, totalSubscribedServices, totalOutstandingBalance }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
    <StatCard label="Total clients" value={totalRecords || clients.length} icon={Briefcase} />
    <StatCard
      label="Companies and firms"
      value={clients.filter((c) => c.clientType !== 'INDIVIDUAL').length}
      icon={Building2}
      tone="neutral"
      hint="on this page"
    />
    <StatCard label="Active services" value={totalSubscribedServices} icon={Layers} tone="success" hint="on this page" />
    <StatCard
      label="Outstanding fees"
      value={`₹${totalOutstandingBalance.toLocaleString('en-IN')}`}
      icon={IndianRupee}
      tone={totalOutstandingBalance > 0 ? 'danger' : 'neutral'}
      hint="on this page"
    />
  </div>
);
