import React from 'react';
import { Link2Off, Unlink } from 'lucide-react';
import { Avatar } from '../../common/Avatar';
import { EmptyState } from '../../common/EmptyState';
import { Button, Table } from '../../ui';

export const AssignmentsTable = ({ assignments, onUnassign }) => (
  <Table
    data={assignments.map((a) => ({ ...a, id: `${a.clientId}-${a.userId}` }))}
    emptyState={<EmptyState icon={Link2Off} title="No pairs yet" description="Pick a client and an employee above, then press Pair client." />}
    columns={[
      { key: 'client', header: 'Client', render: (r) => <span className="font-medium text-fg">{r.client?.clientName || r.clientId}</span> },
      {
        key: 'user',
        header: 'Employee',
        render: (r) => (
          <div className="flex items-center gap-2.5">
            <Avatar firstName={r.user?.firstName} lastName={r.user?.lastName} size="sm" />
            <span className="text-fg">{r.user ? `${r.user.firstName} ${r.user.lastName}` : r.userId}</span>
          </div>
        ),
      },
      { key: 'designation', header: 'Designation', render: (r) => <span className="text-muted">{r.user?.designation || 'CA Staff'}</span> },
      {
        key: 'actions',
        header: '',
        align: 'right',
        render: (r) => (
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={`Remove ${r.user?.firstName || 'this person'} from ${r.client?.clientName || 'this client'}`}
            title="Remove pair"
            onClick={() => onUnassign(r.userId, r.clientId)}
            className="text-danger hover:bg-danger-soft"
          >
            <Unlink className="w-4 h-4" />
          </Button>
        ),
      },
    ]}
  />
);
