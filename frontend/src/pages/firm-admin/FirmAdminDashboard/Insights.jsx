import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ArrowRight, CircleAlert, FlaskConical, Receipt, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { Button, Card } from '../../../components/ui';
import { StatusBar } from '../../../components/dashboard/StatusBar';
import { ChartModeToggle, ChartSkeleton, RangeToggle } from '../../../components/dashboard/charts/chartKit';
import { useChartMode } from '../../../components/dashboard/charts/chartMath';
import { RevenueChart } from '../../../components/dashboard/charts/RevenueChart';
import { AttendanceChart } from '../../../components/dashboard/charts/AttendanceChart';
import { TopOutstanding } from '../../../components/dashboard/charts/TopOutstanding';
import { firmInsightsQuery } from '../../../queries/homeQueries';
import { inrShort } from './format';
import { sampleInsights } from './sampleInsights';

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

const RANGES = [
  { value: 6, label: '6M' },
  { value: 12, label: '12M' },
];

const sum = (xs, key) => xs.reduce((s, x) => s + x[key], 0);
const monthName = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long' });
};

/** Collections in the last complete month vs the one before (the current month is still running). */
const MonthChange = ({ revenue }) => {
  if (revenue.length < 3) return null;
  const last = revenue[revenue.length - 2];
  const before = revenue[revenue.length - 3];
  if (!before.collected) return null;
  const pct = Math.round(((last.collected - before.collected) / before.collected) * 100);
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 h-6 px-2 rounded-full text-xs font-medium ${up ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'}`}>
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {monthName(last.month)} collected {up ? '+' : ''}
      {pct}% vs {monthName(before.month)}
    </span>
  );
};

// TEMPORARY sample data switch: lasts for this browser tab only, so real data always comes back.
const SAMPLE_KEY = 'auditee-sample-charts';
const readSample = () => {
  try {
    return sessionStorage.getItem(SAMPLE_KEY) === '1';
  } catch {
    return false;
  }
};

const SampleBanner = ({ onOff }) => (
  <div className="rise flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-warning/40 bg-warning-soft px-4 py-3">
    <p className="flex items-center gap-2 text-sm font-medium text-warning">
      <FlaskConical className="w-4 h-4 shrink-0" aria-hidden="true" />
      Sample data, not your firm's numbers. Turn it off to see your real charts.
    </p>
    <Button size="sm" variant="secondary" onClick={onOff}>
      Show real data
    </Button>
  </div>
);

/** Trend charts for the firm admin home, from GET /firm-admin/home/insights (loads after the home). */
export const Insights = () => {
  const [sample, setSampleState] = useState(readSample);
  const setSample = (on) => {
    setSampleState(on);
    try {
      if (on) sessionStorage.setItem(SAMPLE_KEY, '1');
      else sessionStorage.removeItem(SAMPLE_KEY);
    } catch {
      // storage blocked: the switch still applies until the page reloads
    }
  };
  const [months, setMonths] = useState(6);
  const [revenueMode, setRevenueMode] = useChartMode('revenue', 'bar');
  const [attendanceMode, setAttendanceMode] = useChartMode('attendance', 'bar');
  const real = useQuery({ ...firmInsightsQuery(months), placeholderData: keepPreviousData, enabled: !sample });
  const data = sample ? sampleInsights(months) : real.data;
  const isLoading = !sample && real.isLoading;
  const { isError, refetch, isFetching } = real;

  if (!sample && isError && !data) {
    return (
      <div className="rise flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-5">
        <p className="flex items-center gap-2 text-sm text-muted">
          <CircleAlert className="w-4 h-4 text-warning shrink-0" aria-hidden="true" />
          Charts couldn't load. If the server was just updated, it may still be restarting.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" icon={FlaskConical} onClick={() => setSample(true)}>
            Show sample data
          </Button>
          <Button size="sm" icon={RefreshCw} loading={isFetching} onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const revenue = data?.revenue || [];
  const days = data?.attendance.days || [];
  const team = data?.attendance.team || 0;
  const workdays = days.filter((d) => ![0, 6].includes(new Date(`${d.day}T00:00:00`).getDay()));
  const avgPresence = team && workdays.length ? Math.round((sum(workdays, 'checkedIn') / (workdays.length * team)) * 100) : null;

  return (
    <section className="space-y-6" aria-label="Trends">
      {sample ? (
        <SampleBanner onOff={() => setSample(false)} />
      ) : (
        <div className="flex justify-end -mb-3">
          <Button size="sm" variant="ghost" icon={FlaskConical} onClick={() => setSample(true)}>
            Show sample data
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <Card
          title="Billed vs collected"
          description={
            isLoading
              ? `Last ${months} months`
              : `Last ${months} months · ${inrShort(sum(revenue, 'billed'))} billed, ${inrShort(sum(revenue, 'collected'))} collected`
          }
          className="rise xl:col-span-2"
          actions={
            <div className="flex items-center gap-2">
              <RangeToggle value={months} options={RANGES} onChange={setMonths} label="Months shown" />
              <ChartModeToggle mode={revenueMode} onChange={setRevenueMode} label="Revenue chart style" />
            </div>
          }
        >
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="space-y-3">
              <MonthChange revenue={revenue} />
              <RevenueChart key={months} data={revenue} money={inrShort} mode={revenueMode} />
            </div>
          )}
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
          description={avgPresence === null ? 'Last 14 days' : `Last 14 days · ${avgPresence}% average on weekdays`}
          className="rise xl:col-span-2"
          actions={<ChartModeToggle mode={attendanceMode} onChange={setAttendanceMode} label="Attendance chart style" />}
        >
          {isLoading ? <ChartSkeleton height={190} /> : <AttendanceChart days={days} team={team} mode={attendanceMode} />}
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
