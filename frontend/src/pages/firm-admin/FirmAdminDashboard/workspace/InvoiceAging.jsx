import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Mail } from 'lucide-react';
import { Button, Card } from '../../../../components/ui';
import { useSendInvoiceEmail } from '../../../../queries/useInvoices';
import { inrShort } from '../format';
import { guard } from './guard';

// Calm for money not yet due, then warmer the longer it is late (checked against both themes).
const BUCKET_COLOR = {
  current: 'var(--chart-progress)',
  d30: 'var(--chart-pending)',
  d60: 'color-mix(in oklab, var(--chart-pending) 45%, var(--chart-overdue))',
  d90: 'var(--chart-overdue)',
  d90plus: 'color-mix(in oklab, var(--chart-overdue) 70%, black)',
};

/** Outstanding fees split by how late they are, with the oldest invoices and a reminder button. */
export const InvoiceAging = ({ aging, sample }) => {
  const navigate = useNavigate();
  const send = useSendInvoiceEmail();
  const total = aging.buckets.reduce((s, b) => s + b.amount, 0);
  const late = total - (aging.buckets.find((b) => b.key === 'current')?.amount || 0);

  return (
    <Card
      title="Unpaid invoices by age"
      description={total ? `${inrShort(total)} outstanding · ${inrShort(late)} past due` : 'Nothing outstanding'}
      className="rise h-full"
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/billing')}>
          Billing
        </Button>
      }
    >
      {total === 0 ? (
        <p className="flex items-center gap-2 py-6 text-sm text-muted">
          <BadgeCheck className="w-4 h-4 text-success" aria-hidden="true" />
          Every invoice is paid.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="flex h-3 rounded-full overflow-hidden bg-sunken gap-0.5" role="img" aria-label={aging.buckets.map((b) => `${b.label}: ${inrShort(b.amount)}`).join(', ')}>
            {aging.buckets
              .filter((b) => b.amount > 0)
              .map((b, i) => (
                <div key={b.key} className="grow-x h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${(b.amount / total) * 100}%`, background: BUCKET_COLOR[b.key], '--i': i }} />
              ))}
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {aging.buckets.map((b) => (
              <div key={b.key} className="min-w-0">
                <dt className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: BUCKET_COLOR[b.key] }} aria-hidden="true" />
                  {b.label}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-fg tabular-nums">{inrShort(b.amount)}</dd>
                <dd className="text-xs text-subtle">{b.count} invoice{b.count === 1 ? '' : 's'}</dd>
              </div>
            ))}
          </dl>

          {aging.oldest.length > 0 && (
            <div className="rounded-xl border border-line">
              <p className="px-4 pt-3 pb-2 text-sm font-medium text-fg">Longest overdue</p>
              <ul className="divide-y divide-line border-t border-line">
                {aging.oldest.map((o) => (
                  <li key={o.invoiceId} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm text-fg truncate">{o.clientName}</span>
                      <span className="block text-xs text-muted">
                        {o.invoiceNumber} · <span className={o.daysOverdue > 60 ? 'text-danger' : ''}>{o.daysOverdue} days late</span>
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-fg tabular-nums">{inrShort(o.balance)}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Mail}
                      disabled={!o.hasEmail}
                      title={o.hasEmail ? 'Email this invoice to the client again' : 'This client has no email address'}
                      loading={send.isPending && send.variables?.invoiceId === o.invoiceId}
                      onClick={guard(sample, () => send.mutate({ invoiceId: o.invoiceId }))}
                    >
                      Remind
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
