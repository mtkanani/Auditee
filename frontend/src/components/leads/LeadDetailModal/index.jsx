import React from 'react';
import { Modal } from '../../common/Modal';
import { useLeadDetailModal } from './useLeadDetailModal';
import { LeadHeaderCard } from './LeadHeaderCard';
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? `CRM Lead: ${lead.leadName} (${lead.companyName || 'Individual'})` : 'Loading Lead...'}
      maxWidth="max-w-4xl"
    >
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading Lead CRM Details...</div>
      ) : lead ? (
        <div className="space-y-6">
          {/* Header Card with Pipeline Stage & Actions */}
          <LeadHeaderCard {...detail} />

          {/* Navigation Tabs */}
          <LeadTabs {...detail} />

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && <OverviewTab lead={lead} />}

          {/* TAB 2: CALL HISTORY */}
          {activeTab === 'calls' && <CallsTab {...detail} />}

          {/* TAB 3: MEETING NOTES */}
          {activeTab === 'meetings' && <MeetingsTab {...detail} />}

          {/* TAB 4: PROPOSALS & QUOTATIONS */}
          {activeTab === 'proposals' && <ProposalsTab {...detail} />}
        </div>
      ) : null}
    </Modal>
  );
};
