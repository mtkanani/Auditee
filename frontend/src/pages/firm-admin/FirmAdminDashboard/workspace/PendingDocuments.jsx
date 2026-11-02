import React, { useState } from 'react';
import { BellRing, Check, FileClock, Plus } from 'lucide-react';
import { Badge, Button, Card } from '../../../../components/ui';
import { useRemindDocumentRequest, useSetDocumentRequestStatus } from '../../../../queries/useDocumentRequests';
import { dueLabel } from '../format';
import { timeAgo } from '../../../../utils/timeAgo';
import { guard } from './guard';
import { RequestDocumentModal } from './RequestDocumentModal';

/** Documents the firm is waiting for from clients: remind them, or tick them off when they arrive. */
export const PendingDocuments = ({ documents, sample }) => {
  const [asking, setAsking] = useState(false);
  const remind = useRemindDocumentRequest();
  const setStatus = useSetDocumentRequestStatus();
  const busy = (id) => (remind.isPending && remind.variables === id) || (setStatus.isPending && setStatus.variables?.id === id);

  return (
    <Card
      title="Waiting on clients"
      description={documents.pending ? `${documents.pending} document${documents.pending === 1 ? '' : 's'} requested` : 'Documents you asked clients for'}
      className="rise h-full"
      padded={false}
      actions={
        <Button size="sm" variant="soft" icon={Plus} onClick={guard(sample, () => setAsking(true))}>
          Request
        </Button>
      }
    >
      {documents.items.length === 0 ? (
        <p className="flex items-center gap-2 px-5 pb-5 pt-1 text-sm text-muted">
          <FileClock className="w-4 h-4 text-subtle" aria-hidden="true" />
          Nothing outstanding. Ask a client for a document and track it here.
        </p>
      ) : (
        <ul className="divide-y divide-line border-t border-line">
          {documents.items.map((d) => {
            const due = d.dueDate ? dueLabel(d.dueDate) : null;
            return (
              <li key={d.id} className="px-5 py-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-fg truncate">{d.title}</p>
                    <p className="text-xs text-muted truncate">
                      {d.client} · asked {timeAgo(d.requestedAt)}
                      {d.lastRemindedAt && ` · reminded ${timeAgo(d.lastRemindedAt)}`}
                    </p>
                  </div>
                  {due && <Badge tone={due.tone}>{due.text.replace('Due in', 'In')}</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" icon={BellRing} disabled={busy(d.id)} onClick={guard(sample, () => remind.mutate(d.id))}>
                    Remind
                  </Button>
                  <Button size="sm" variant="ghost" icon={Check} disabled={busy(d.id)} onClick={guard(sample, () => setStatus.mutate({ id: d.id, status: 'RECEIVED' }))}>
                    Received
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {documents.pending > documents.items.length && (
        <p className="px-5 py-3 border-t border-line text-xs text-muted">and {documents.pending - documents.items.length} more</p>
      )}
      <RequestDocumentModal isOpen={asking} onClose={() => setAsking(false)} />
    </Card>
  );
};
