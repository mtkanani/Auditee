import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { LeadDetailModal } from '../../../components/leads/LeadDetailModal';
import { Plus } from 'lucide-react';
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
    isDetailModalOpen,
    setIsDetailModalOpen,
  } = view;

  const columns = getLeadColumns(view);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Management (CRM)"
        subtitle="Track potential clients, log calls & meetings, issue proposals, and convert inquiries into Master Clients"
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4"  />
            <span>Add New Lead</span>
          </button>
        }
      />

      {/* Top Metrics Cards */}
      <LeadStats {...view} />

      {/* Control Bar: View Toggle & Filters */}
      <LeadControlBar {...view} />

      {/* VIEW 1: VISUAL CRM PIPELINE KANBAN BOARD */}
      {viewMode === 'kanban' && <PipelineBoard {...view} />}

      {/* VIEW 2: MASTER TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <DataTable columns={columns} data={leads} isLoading={isLoading} />
          <Pagination
            currentPage={page}
            totalPages={pagination?.totalPages || 1}
            totalRecords={pagination?.totalRecords || 0}
            limit={10}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Lead 360 Detail CRM Hub Modal */}
      <LeadDetailModal
        leadId={selectedLeadId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* Add New Lead Modal */}
      <AddLeadModal {...view} />
    </div>
  );
};
