import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Sparkles } from 'lucide-react';
import { Button, Card } from '../../../../components/ui';
import { inrShort } from '../format';

const since = (d) => (d ? `last invoiced ${new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : 'never invoiced');

/** Clients with finished work and no invoice since: money already earned but not billed yet. */
export const ReadyToBill = ({ ready }) => {
  const navigate = useNavigate();
  const usual = ready.clients.reduce((s, c) => s + c.monthlyFee, 0);
  const newInvoice = () => navigate('/firm-admin/billing', { state: { openCreate: true } });

  return (
    <Card
      title="Ready to bill"
      description={
        ready.taskCount
          ? `${ready.taskCount} finished task${ready.taskCount === 1 ? '' : 's'} across ${ready.clientCount} client${ready.clientCount === 1 ? '' : 's'} since their last invoice`
          : 'Finished work that has not been invoiced'
      }
      className="rise h-full"
      padded={false}
    >
      {ready.clients.length === 0 ? (
        <p className="flex items-center gap-2 px-5 pb-5 pt-1 text-sm text-muted">
          <Sparkles className="w-4 h-4 text-success" aria-hidden="true" />
          All finished work has been billed.
        </p>
      ) : (
        <>
          <ul className="divide-y divide-line border-t border-line">
            {ready.clients.map((c, i) => (
              <li key={c.clientId} className="rise flex items-center gap-3 px-5 py-3" style={{ '--i': i }}>
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-success-soft text-success text-sm font-semibold tabular-nums shrink-0" aria-label={`${c.tasks} tasks`}>
                  {c.tasks}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-fg truncate">{c.name}</span>
                  <span className="block text-xs text-muted truncate">
                    {c.tasks} done · {since(c.lastInvoice)}
                    {c.monthlyFee > 0 && ` · usual fee ${inrShort(c.monthlyFee)}`}
                  </span>
                </span>
                <Button size="sm" variant="soft" icon={Receipt} onClick={newInvoice} aria-label={`Create an invoice for ${c.name}`}>
                  Bill
                </Button>
              </li>
            ))}
          </ul>
          {usual > 0 && (
            <p className="px-5 py-3 border-t border-line text-xs text-muted">
              Their usual fees add up to <span className="font-medium text-fg">{inrShort(usual)}</span> a month.
            </p>
          )}
        </>
      )}
    </Card>
  );
};
