import React from 'react';
import { ClipboardPlus, Link2 } from 'lucide-react';
import { Button } from '../../ui';

export const ActionColumn = ({ handleAssignClick, selectedClient, selectedUser, isLoading, handleOpenTaskModal }) => {
  const hint = !selectedUser
    ? 'Pick an employee to start.'
    : !selectedClient
      ? `Pick a client to pair with ${selectedUser.firstName}, or give them a direct task.`
      : `Pair ${selectedUser.firstName} with ${selectedClient.clientName}, or give a task for this client.`;

  return (
    <section aria-label="Actions" className="md:col-span-2 lg:col-span-1 rounded-2xl border border-line bg-surface shadow-card p-4 flex flex-col justify-center gap-3">
      <p className="text-sm text-muted text-center" aria-live="polite">{hint}</p>
      <Button variant="primary" icon={Link2} onClick={handleAssignClick} disabled={!selectedClient || !selectedUser || isLoading} className="w-full">
        Pair client
      </Button>
      <Button icon={ClipboardPlus} onClick={handleOpenTaskModal} disabled={!selectedUser || isLoading} className="w-full">
        Direct task
      </Button>
    </section>
  );
};
