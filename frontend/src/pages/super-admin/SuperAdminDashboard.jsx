import React from 'react';
import { ArrowRight, Building2, CircleCheckBig, CirclePause, OctagonAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, PageHeader, StatCard, StatusTag, Table } from '../../components/ui';
import { EmptyState } from '../../components/common/EmptyState';
import { useFirmsList } from '../../queries/useFirms';

// limit: 1 queries are only for their totalRecords count.
const useFirmCount = (status) => {
  const { totalRecords, isLoading } = useFirmsList({ limit: 1, ...(status ? { status } : {}) });
  return isLoading ? '…' : totalRecords ?? 0;
};

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { firms, isLoading } = useFirmsList({ limit: 5 });

  const total = useFirmCount();
  const active = useFirmCount('ACTIVE');
  const inactive = useFirmCount('INACTIVE');
  const suspended = useFirmCount('SUSPENDED');

  const openFirms = () => navigate('/super-admin/firms');

  const columns = [
    { header: 'Firm', key: 'firmName', render: (r) => <span className="font-medium text-fg">{r.firmName}</span> },
    { header: 'Admin email', key: 'email', render: (r) => <span className="text-muted">{r.email || '—'}</span> },
    { header: 'City', key: 'city', render: (r) => <span className="text-muted">{r.city || '—'}</span> },
    { header: 'Status', key: 'status', render: (r) => (r.status ? <StatusTag status={r.status} /> : '—') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform"
        description="CA firms on Auditee and their status."
        actions={
          <Button variant="primary" iconRight={ArrowRight} onClick={openFirms}>
            Manage firms
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="All firms" value={total} icon={Building2} tone="accent" onClick={openFirms} />
        <StatCard label="Active" value={active} icon={CircleCheckBig} tone="success" />
        <StatCard label="Inactive" value={inactive} icon={CirclePause} tone="neutral" />
        <StatCard label="Suspended" value={suspended} icon={OctagonAlert} tone="danger" />
      </div>

      <section className="space-y-3" aria-labelledby="recent-firms">
        <h2 id="recent-firms" className="text-base font-semibold text-fg">Recently added firms</h2>
        <Table
          columns={columns}
          data={firms}
          isLoading={isLoading}
          onRowClick={openFirms}
          emptyState={<EmptyState icon={Building2} title="No firms yet" description="Firms you onboard will show up here." />}
        />
      </section>
    </div>
  );
};
