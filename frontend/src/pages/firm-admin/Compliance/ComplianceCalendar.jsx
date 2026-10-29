import React from 'react';
import { Bell, CalendarDays, ShieldCheck, TriangleAlert, Zap } from 'lucide-react';
import { Badge, Button, Card, Select } from '../../../components/ui';
import { EmptyState } from '../../../components/common/EmptyState';
import { dueLabel } from '../../../utils/dueDate';
import { STATUSES, categoryLabel, shortDate } from './options';

const DeadlineCard = ({ item, handleStatusChange, onConvert, handleSendReminder }) => {
  const due = item.status === 'FILED' ? { text: 'Filed', tone: 'success' } : dueLabel(item.dueDate);
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface p-4 shadow-card transition-all duration-150 hover:shadow-raised hover:border-line-strong">
      <div className="flex items-center justify-between gap-2">
        <Badge tone="accent">{categoryLabel(item.category)}</Badge>
        <Badge tone={due.tone} dot>{due.text}</Badge>
      </div>

      <h4 className="mt-3 text-sm font-semibold text-fg line-clamp-2">{item.title}</h4>
      <p className="mt-0.5 text-xs text-subtle truncate">
        {[item.period, item.client?.companyName || item.client?.clientName || 'All clients'].filter(Boolean).join(' · ')}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
        <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" /> {shortDate(item.dueDate)}
      </p>

      {item.penaltyDetails && (
        <p className="mt-3 flex gap-1.5 rounded-lg bg-warning-soft px-2.5 py-2 text-xs text-warning">
          <TriangleAlert className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
          {item.penaltyDetails}
        </p>
      )}

      <div className="mt-auto pt-4 flex items-center gap-2">
        <Select
          aria-label={`Status of ${item.title}`}
          value={item.status || 'UPCOMING'}
          onChange={(e) => handleStatusChange(item.id, e.target.value)}
          options={STATUSES}
          className="h-8 text-xs"
        />
        <Button size="sm" variant="soft" icon={Zap} onClick={() => onConvert(item)} className="shrink-0">
          Make task
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label={`Send reminder for ${item.title}`} title="Post a reminder on the notice board" onClick={() => handleSendReminder(item)} className="shrink-0">
          <Bell className="w-4 h-4" />
        </Button>
      </div>
    </article>
  );
};

/** Card grid of filings, nearest deadline first (server order). */
export const ComplianceCalendar = ({ isLoading, items, handleStatusChange, setSelectedItem, setIsTaskModalOpen, handleSendReminder }) => {
  const onConvert = (item) => {
    setSelectedItem(item);
    setIsTaskModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-line bg-surface p-4 space-y-3">
            <div className="flex justify-between"><div className="h-6 w-16 rounded-full bg-hover animate-pulse" /><div className="h-6 w-24 rounded-full bg-hover animate-pulse" /></div>
            <div className="h-4 w-3/4 rounded-full bg-hover animate-pulse" />
            <div className="h-3 w-1/2 rounded-full bg-hover animate-pulse" />
            <div className="h-8 rounded-xl bg-hover animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={ShieldCheck}
          title="No filings here"
          description="Use 'Generate statutory deadlines' above to add this month's GST, TDS and PF due dates, or change the filters."
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((item) => (
        <DeadlineCard key={item.id} item={item} handleStatusChange={handleStatusChange} onConvert={onConvert} handleSendReminder={handleSendReminder} />
      ))}
    </div>
  );
};
