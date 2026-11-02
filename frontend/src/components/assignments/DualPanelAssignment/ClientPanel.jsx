import React from 'react';
import { Briefcase } from 'lucide-react';
import { Badge } from '../../ui';
import { PickerPanel } from './PickerPanel';

export const ClientPanel = ({ filteredClients, searchClient, setSearchClient, selectedClient, setSelectedClient, assignedCountByClient }) => (
  <PickerPanel
    className="lg:col-span-2"
    icon={Briefcase}
    title="Client"
    hint="Optional for a direct task"
    search={searchClient}
    setSearch={setSearchClient}
    searchLabel="Filter clients"
    selectedId={selectedClient?.id}
    onToggle={(client) => setSelectedClient(selectedClient?.id === client.id ? null : client)}
    items={filteredClients.map((client) => {
      const count = assignedCountByClient.get(client.id) || 0;
      return {
        ...client,
        title: client.clientName,
        subtitle: client.companyName || client.email,
        meta: <Badge className="shrink-0">{count} {count === 1 ? 'person' : 'people'}</Badge>,
      };
    })}
  />
);
