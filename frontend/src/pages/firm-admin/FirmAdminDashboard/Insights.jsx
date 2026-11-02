import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Receipt } from 'lucide-react';
import { Button, Card } from '../../../components/ui';
import { StatusBar } from '../../../components/dashboard/StatusBar';
import { ChartSkeleton } from '../../../components/dashboard/charts/chartKit';
import { RevenueChart } from '../../../components/dashboard/charts/RevenueChart';
import { AttendanceChart } from '../../../components/dashboard/charts/AttendanceChart';
import { TopOutstanding } from '../../../components/dashboard/charts/TopOutstanding';
import { firmInsightsQuery } from '../../../queries/homeQueries';
import { inrShort } from './format';

const LinkButton = ({ to, children }) => {
  const navigate = useNavigate();
  return (
    <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate(to)}>
      {children}
    </Button>
  );
};

// Overdue first and never next to amber or green (checked with the dataviz palette validator).
const complianceSegments = (c) => [
  { key: 'overdue', label: 'Overdue', value: c.overdue, color: 'var(--chart-overdue)' },
  { key: 'upcoming', label: 'Upcoming', value: c.upcoming, color: 'var(--chart-progress)' },
  { key: 'progress', label: 'In progress', value: c.inProgress, color: 'var(--chart-pending)' },
  { key: 'filed', label: 'Filed', value: c.filed, color: 'var(--chart-done)' },
];

const sum = (xs, key) => xs.reduce((s, x) => s + x[key], 0);

/** Trend charts for the firm admin home, from GET /firm-admin/home/insights (loads after the home). */
export const Insights = () => {
  const { data, isLoading, isError } = useQuery(firmInsightsQuery);
  if (isError) return null;

  const revenue = data?.revenue || [];
  const billed6 = sum(revenue, 'billed');
  const collected6 = sum(revenue, 'collected');
  const days = data?.attendance.days || [];
  const team = data?.attendance.team || 0;
  const workdays = days.filter((d) => ![0, 6].includes(new Date(`${d.day}T00:00:00`).getDay()));
  const avgPresence = team && workdays.length ? Math.round((sum(workdays, 'checkedIn') / (workdays.length * team)) * 100) : null;

  return (
    <section className="space-y-6" aria-label="Trends">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <Card
          title="Billed vs collected"
          description={isLoading ? 'Last 6 months' : `Last 6 months · ${inrShort(billed6)} billed, ${inrShort(collected6)} collected`}
          className="rise xl:col-span-2"
          actions={<LinkButton to="/firm-admin/billing">Billing</LinkButton>}
        >
          {isLoading ? <ChartSkeleton /> : <RevenueChart data={revenue} money={inrShort} />}
        </Card>

        <Card
          title="Compliance pipeline"
          description="All filings by status"
          className="rise"
          actions={<LinkButton to="/firm-admin/compliance">Compliance</LinkButton>}
        >
          {isLoading ? (
            <ChartSkeleton height={96} />
          ) : (
            <StatusBar segments={complianceSegments(data.compliance)} emptyText="No filings yet." />
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <Card
          title="Team attendance"
          description={
            isLoading
              ? 'Last 14 days'
              : avgPresence === null
                ? 'Last 14 days'
                : `Last 14 days · ${avgPresence}% average on weekdays`
          }
          className="rise xl:col-span-2"
          actions={<LinkButton to="/firm-admin/attendance">Attendance</LinkButton>}
        >
          {isLoading ? <ChartSkeleton height={180} /> : <AttendanceChart days={days} team={team} />}
        </Card>

        <Card
          title="Top outstanding"
          description="Clients with the most unpaid fees"
          className="rise"
          actions={<LinkButton to="/firm-admin/billing">Billing</LinkButton>}
        >
          {isLoading ? (
            <ChartSkeleton height={180} />
          ) : data.topOutstanding.length ? (
            <TopOutstanding rows={data.topOutstanding} money={inrShort} />
          ) : (
            <p className="flex items-center gap-2 py-6 text-sm text-muted">
              <Receipt className="w-4 h-4 text-subtle" aria-hidden="true" />
              Every invoice is paid.
            </p>
          )}
        </Card>
      </div>
    </section>
  );
};
