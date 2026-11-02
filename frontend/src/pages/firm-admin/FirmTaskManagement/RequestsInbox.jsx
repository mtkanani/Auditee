import React from 'react';
import { Check, Inbox, X } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/ui';
import { EmptyState } from '../../../components/common/EmptyState';

/** Work requests clients submitted from their portal, waiting to be accepted or rejected. */
export const RequestsInbox = ({
  clientRequests,
  rejectRequestMutation,
  approveRequestMutation,
  handleRejectRequest,
  setSelectedRequest,
  setRequestAssignmentScope,
  setRequestSelectedUserIds,
  setIsApproveModalOpen,
}) => {
  const busy = rejectRequestMutation.isPending || approveRequestMutation.isPending;

  if (clientRequests.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Inbox}
          title="No client requests waiting"
          description="When clients submit work from their portal, it shows up here for you to accept."
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {clientRequests.map((req) => (
        <Card key={req.id}>
          <div className="flex items-center justify-between gap-3">
            <Badge tone="accent" dot>Client request</Badge>
            <span className="text-xs text-subtle">
              {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <h3 className="mt-3 text-[15px] font-semibold text-fg">{req.title}</h3>
          <p className="text-sm text-muted mt-0.5">
            {req.client?.companyName || req.client?.clientName}
            {req.client?.email && <span className="text-subtle"> · {req.client.email}</span>}
          </p>
          {req.description && (
            <p className="mt-3 text-sm text-fg p-3 rounded-xl bg-sunken border border-line">{req.description}</p>
          )}

          <div className="mt-4 pt-4 border-t border-line flex justify-end gap-2">
            <Button
              variant="danger"
              icon={X}
              disabled={busy}
              loading={rejectRequestMutation.isPending && rejectRequestMutation.variables === req.id}
              onClick={() => handleRejectRequest(req.id)}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              icon={Check}
              disabled={busy}
              onClick={() => {
                setSelectedRequest(req);
                setRequestAssignmentScope('SINGLE');
                setRequestSelectedUserIds([]);
                setIsApproveModalOpen(true);
              }}
            >
              Accept and assign
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
