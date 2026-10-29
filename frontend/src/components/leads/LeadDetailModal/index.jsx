import React from 'react';
import { Loader2, SearchX } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { useLeadDetailModal } from './useLeadDetailModal';
import { LeadHeader, LeadStageBar } from './LeadHeaderCard';
import { LeadTabs } from './LeadTabs';
import { OverviewTab } from './OverviewTab';
import { CallsTab } from './CallsTab';
import { MeetingsTab } from './MeetingsTab';
import { ProposalsTab } from './ProposalsTab';

export const LeadDetailModal = ({ leadId, isOpen, onClose, onRefresh }) => {
  const detail = useLeadDetailModal({ leadId, isOpen, onRefresh });
  const { lead, isLoading, activeTab } = detail;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<LeadHeader lead={lead} />} maxWidth="max-w-4xl">
      <div className="-m-6 flex flex-col min-h-0">
        {lead && <LeadStageBar {...detail} />}

        <LeadTabs {...detail} />

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Loading lead…
            </div>
          ) : !lead ? (
            <div className="flex flex-col items-center py-16 text-center">
              <SearchX className="w-6 h-6 text-subtle mb-2" aria-hidden="true" />
              <p className="text-sm font-medium text-fg">We couldn't load this lead</p>
              <p className="text-sm text-muted">It may have been deleted. Close this and refresh the list.</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewTab lead={lead} />}
              {activeTab === 'calls' && <CallsTab {...detail} />}
              {activeTab === 'meetings' && <MeetingsTab {...detail} />}
              {activeTab === 'proposals' && <ProposalsTab {...detail} />}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
