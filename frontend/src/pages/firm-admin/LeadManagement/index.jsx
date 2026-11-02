import React from 'react';
import { Plus, Target } from 'lucide-react';
import { Pagination } from '../../../components/common/Pagination';
import { EmptyState } from '../../../components/common/EmptyState';
import { LeadDetailModal } from '../../../components/leads/LeadDetailModal';
import { Button, PageHeader, Table } from '../../../components/ui';
import { useLeadManagement } from './useLeadManagement';
import { getLeadColumns } from './leadColumns';
import { LeadStats } from './LeadStats';
import { LeadControlBar } from './LeadControlBar';
import { PipelineBoard } from './PipelineBoard';
import { AddLeadModal } from './AddLeadModal';

export const LeadManagement = () => {
  const view = useLeadManagement();
  const {
    viewMode,
    setIsAddModalOpen,
    leads,
    isLoading,
    page,
    setPage,
    pagination,
    selectedLeadId,
    setSelectedLeadId,
    isDetailModalOpen,
    setIsDetailModalOpen,
  } = view;

  const columns = getLeadColumns(view);
  const addButton = (
    <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
      Add lead
    </Button>
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Leads"
        description="Track enquiries from first call to proposal, then convert the ones you win into clients."
        actions={addButton}
      />

      <LeadStats {...view} />

      <LeadControlBar {...view} />

      {viewMode === 'kanban' && <PipelineBoard {...view} />}

      {viewMode === 'table' && (
        <Table
          columns={columns}
          data={leads}
          isLoading={isLoading}
          onRowClick={(lead) => {
            setSelectedLeadId(lead.id);
            setIsDetailModalOpen(true);
          }}
          emptyState={
            <EmptyState
              icon={Target}
              title="No leads found"
              description="Try a different search or stage, or add the next enquiry that comes in."
              action={addButton}
            />
          }
          footer={
            <Pagination
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              totalRecords={pagination?.totalRecords || 0}
              limit={10}
              onPageChange={setPage}
            />
          }
        />
      )}

      <LeadDetailModal leadId={selectedLeadId} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />

      <AddLeadModal {...view} />
    </div>
  );
};
