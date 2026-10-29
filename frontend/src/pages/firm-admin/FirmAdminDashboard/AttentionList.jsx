import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarClock, CircleCheckBig, Receipt } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { dueLabel, inrShort } from './dates';

const Row = ({ icon: Icon, tone, title, subtitle, badge, onClick }) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-hover transition-colors focus-visible:outline-none focus-visible:bg-hover"
    >
      <span
        className={cn(
          'grid place-items-center w-9 h-9 rounded-xl shrink-0',
          tone === 'danger' ? 'bg-danger-soft text-danger' : tone === 'warning' ? 'bg-warning-soft text-warning' : 'bg-hover text-muted'
        )}
      >
        <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-fg truncate">{title}</span>
        <span className="block text-xs text-subtle truncate">{subtitle}</span>
      </span>
      {badge}
    </button>
  </li>
);

/** Deadlines in the next 7 days (overdue first) plus overdue invoices. */
export const AttentionList = ({ attention, invoiceSummary, loading }) => {
  const navigate = useNavigate();
  const overdueInvoices = invoiceSummary.overdueCount || 0;
  const empty = !loading && attention.length === 0 && overdueInvoices === 0;

  return (
    <Card
      title="Needs your attention"
      description="Deadlines this week and anything overdue"
      padded={false}
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/compliance')}>
          Compliance
        </Button>
      }
    >
      {loading ? (
        <ul className="divide-y divide-line border-t border-line">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-5 py-3">
              <span className="w-9 h-9 rounded-xl bg-hover animate-pulse" />
              <span className="flex-1 space-y-2">
                <span className="block h-3.5 w-1/2 rounded-full bg-hover animate-pulse" />
                <span className="block h-3 w-1/3 rounded-full bg-hover animate-pulse" />
              </span>
            </li>
          ))}
        </ul>
      ) : empty ? (
        <div className="flex flex-col items-center text-center px-5 py-10 border-t border-line">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-success-soft text-success mb-3">
            <CircleCheckBig className="w-6 h-6" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium text-fg">You're all caught up</p>
          <p className="text-sm text-muted mt-0.5">Nothing is overdue and no filings are due this week.</p>
        </div>
      ) : (
        <ul className="divide-y divide-line border-t border-line">
          {overdueInvoices > 0 && (
            <Row
              icon={Receipt}
              tone="danger"
              title={`${overdueInvoices} invoice${overdueInvoices === 1 ? ' is' : 's are'} overdue`}
              subtitle={`${inrShort(invoiceSummary.balanceAmount)} outstanding in total`}
              badge={<Badge tone="danger" dot>Follow up</Badge>}
              onClick={() => navigate('/firm-admin/billing')}
            />
          )}
          {attention.map((item) => {
            const due = dueLabel(item.dueDate);
            return (
              <Row
                key={item.id}
                icon={CalendarClock}
                tone={due.tone}
                title={item.title}
                subtitle={item.subtitle}
                badge={<Badge tone={due.tone} dot>{due.text}</Badge>}
                onClick={() => navigate('/firm-admin/compliance')}
              />
            );
          })}
        </ul>
      )}
    </Card>
  );
};
