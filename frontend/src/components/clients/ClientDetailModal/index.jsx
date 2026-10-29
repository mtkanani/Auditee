import React from 'react';
import { Loader2, SearchX } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { useClientDetailModal } from './useClientDetailModal';
import { ClientHeader } from './ClientHeader';
import { DetailTabs } from './DetailTabs';
import { ProfileTab } from './ProfileTab';
import { ServicesTab } from './ServicesTab';
import { BillingTab } from './BillingTab';
import { DocumentsTab } from './DocumentsTab';
import { HistoryTab } from './HistoryTab';

export const ClientDetailModal = ({ clientId, isOpen, onClose, onRefresh }) => {
  const detail = useClientDetailModal({ clientId, isOpen, onRefresh });
  const { activeTab, client, isLoading } = detail;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<ClientHeader client={client} />} maxWidth="max-w-5xl">
      <div className="-m-6 flex flex-col min-h-0">
        <DetailTabs {...detail} />

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Loading client…
            </div>
          ) : !client ? (
            <div className="flex flex-col items-center py-16 text-center">
              <SearchX className="w-6 h-6 text-subtle mb-2" aria-hidden="true" />
              <p className="text-sm font-medium text-fg">We couldn't load this client</p>
              <p className="text-sm text-muted">It may have been deleted. Close this and refresh the list.</p>
            </div>
          ) : (
            <>
              {activeTab === 'profile' && <ProfileTab client={client} />}
              {activeTab === 'services' && <ServicesTab {...detail} />}
              {activeTab === 'billing' && <BillingTab client={client} />}
              {activeTab === 'documents' && <DocumentsTab {...detail} />}
              {activeTab === 'history' && <HistoryTab client={client} />}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
