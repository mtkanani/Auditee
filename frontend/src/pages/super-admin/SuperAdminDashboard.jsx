import React from 'react';
import { ArrowRight, Building2, CircleCheckBig, CirclePause, OctagonAlert, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, StatCard, StatusTag, Table } from '../../components/ui';
import { EmptyState } from '../../components/common/EmptyState';
import { DashboardHero } from '../../components/dashboard/DashboardHero';
import { greeting } from '../../components/dashboard/dashboardData';
import { ProgressRing } from '../../components/dashboard/ProgressRing';
import { useAuth } from '../../context/AuthContext';
import { useFirmsList } from '../../queries/useFirms';

// limit: 1 queries are only for their totalRecords count.
const useFirmCount = (status) => {
  const { totalRecords, isLoading } = useFirmsList({ limit: 1, ...(status ? { status } : {}) });
  return { count: totalRecords ?? 0, isLoading };
};

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const shareOf = (part, total) => (total ? `${Math.round((part / total) * 100)}% of firms` : undefined);
const addedOn = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { firms, isLoading } = useFirmsList({ limit: 5 });

  const total = useFirmCount();
  const active = useFirmCount('ACTIVE');
  const inactive = useFirmCount('INACTIVE');
  const suspended = useFirmCount('SUSPENDED');
  const loading = total.isLoading || active.isLoading;
  const show = (c) => (c.isLoading ? '…' : c.count);

  const openFirms = () => navigate('/super-admin/firms');
  const newFirm = () => navigate('/super-admin/firms', { state: { openCreate: true } });

  const columns = [
    { header: 'Firm', key: 'firmName', render: (r) => <span className="font-medium text-fg">{r.firmName}</span> },
    { header: 'Admin email', key: 'email', render: (r) => <span className="text-muted">{r.email || '—'}</span> },
    { header: 'City', key: 'city', render: (r) => <span className="text-muted">{r.city || '—'}</span> },
    { header: 'Added', key: 'createdAt', render: (r) => <span className="text-muted tabular-nums">{addedOn(r.createdAt)}</span> },
    { header: 'Status', key: 'status', render: (r) => (r.status ? <StatusTag status={r.status} /> : '—') },
  ];

  const highlights = suspended.isLoading
    ? []
    : [
        { label: `${plural(total.count, 'firm')} on Auditee`, tone: 'accent', icon: Building2 },
        suspended.count ? { label: `${suspended.count} suspended`, tone: 'danger', icon: OctagonAlert } : null,
      ].filter(Boolean);

  return (
    <div className="space-y-6 pb-8">
      <DashboardHero
        title={`${greeting()}${user?.firstName ? `, ${user.firstName}` : ''}`}
        description="The CA firms on the platform and how they're doing."
        highlights={highlights}
        actions={
          <>
            <Button size="sm" variant="primary" icon={Plus} onClick={newFirm}>
              New firm
            </Button>
            <Button size="sm" iconRight={ArrowRight} onClick={openFirms}>
              Manage firms
            </Button>
          </>
        }
        aside={
          <ProgressRing
            value={active.count}
            total={total.count}
            label="active"
            caption={loading ? undefined : `${active.count} of ${plural(total.count, 'firm')} active`}
          />
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="All firms" value={show(total)} icon={Building2} tone="accent" onClick={openFirms} />
        <StatCard label="Active" value={show(active)} icon={CircleCheckBig} tone="success" hint={shareOf(active.count, total.count)} />
        <StatCard label="Inactive" value={show(inactive)} icon={CirclePause} tone="neutral" hint={shareOf(inactive.count, total.count)} />
        <StatCard label="Suspended" value={show(suspended)} icon={OctagonAlert} tone="danger" hint={shareOf(suspended.count, total.count)} />
      </div>

      <section className="space-y-3" aria-labelledby="recent-firms">
        <div className="flex items-center justify-between gap-3">
          <h2 id="recent-firms" className="text-base font-semibold text-fg">Recently added firms</h2>
          <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={openFirms}>
            All firms
          </Button>
        </div>
        <Table
          columns={columns}
          data={firms}
          isLoading={isLoading}
          onRowClick={openFirms}
          emptyState={
            <EmptyState
              icon={Building2}
              title="No firms yet"
              description="Firms you onboard will show up here."
              action={<Button variant="primary" icon={Plus} onClick={newFirm}>New firm</Button>}
            />
          }
        />
      </section>
    </div>
  );
};
