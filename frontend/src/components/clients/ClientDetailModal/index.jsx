import React from 'react';
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<ClientHeader client={client} />}
      maxWidth="max-w-5xl"
    >
      <div className="-m-6 flex flex-col min-h-0">
        {/* Tab Navigation Header */}
          <DetailTabs {...detail} />

          {/* Modal Tab Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-500">Loading master details...</div>
            ) : !client ? (
              <div className="p-12 text-center text-sm text-rose-400">Client details not found</div>
            ) : (
              <>
                {/* TAB 1: Profile & Tax Info */}
                {activeTab === 'profile' && <ProfileTab client={client} />}

                {/* TAB 2: Services Subscribed */}
                {activeTab === 'services' && <ServicesTab {...detail} />}

                {/* TAB 3: Billing & Financials */}
                {activeTab === 'billing' && <BillingTab client={client} />}

                {/* TAB 4: Master Documents */}
                {activeTab === 'documents' && <DocumentsTab {...detail} />}

                {/* TAB 5: Client History */}
                {activeTab === 'history' && <HistoryTab client={client} />}
              </>
            )}
          </div>
      </div>
    </Modal>
  );
};
