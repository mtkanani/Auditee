import React, { useEffect, useState } from 'react';
import { Briefcase, FileText, Mail, MapPin, Phone } from 'lucide-react';
import { FilterBar, PageHeader, SearchInput, StatusTag } from '../../components/ui';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/Skeleton';
import { useMyClients } from '../../queries/useClients';
import toast from 'react-hot-toast';

const Detail = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 min-w-0">
    <Icon className="w-3.5 h-3.5 text-subtle shrink-0" aria-hidden="true" />
    <span className="truncate">{children}</span>
  </div>
);

export const MyClients = () => {
  const { clients, error, isLoading } = useMyClients();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (error) {
      toast.error('Failed to load assigned clients');
    }
  }, [error]);

  const filteredClients = clients.filter(
    (c) =>
      c.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      c.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="My clients" description="Contact details and company profiles for the clients you work on." />

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search my clients" />
      </FilterBar>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="rounded-2xl bg-surface border border-line">
          <EmptyState
            icon={Briefcase}
            title={search ? 'No clients match your search' : 'No clients assigned yet'}
            description={search ? 'Try a different name.' : 'Clients your firm assigns to you will show up here.'}
          />
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <li key={client.id} className="p-5 rounded-2xl bg-surface border border-line shadow-card space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent-soft text-accent-fg shrink-0">
                    <Briefcase className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-fg line-clamp-2 break-words">{client.clientName}</h2>
                    <p className="text-xs text-muted truncate">{client.companyName || 'Individual client'}</p>
                  </div>
                </div>
                <StatusTag status={String(client.status || 'ACTIVE').toUpperCase()} />
              </div>

              <div className="grid gap-2 pt-3 border-t border-line text-xs text-muted">
                <Detail icon={Mail}>{client.email || '—'}</Detail>
                <Detail icon={Phone}>{client.phone || '—'}</Detail>
                <Detail icon={FileText}>GST {client.gstNumber || '—'}</Detail>
                <Detail icon={MapPin}>{client.city || '—'}</Detail>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
