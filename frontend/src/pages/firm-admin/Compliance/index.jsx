import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { Plus } from 'lucide-react';
import { useCompliancePage } from './useCompliancePage';
import { getComplianceColumns } from './complianceColumns';
import { ComplianceStats } from './ComplianceStats';
import { PresetsGenerator } from './PresetsGenerator';
import { ComplianceFilters } from './ComplianceFilters';
import { ComplianceCalendar } from './ComplianceCalendar';
import { ConvertToTaskModal } from './ConvertToTaskModal';
import { AddComplianceModal } from './AddComplianceModal';

export const Compliance = () => {
  const view = useCompliancePage();
  const { viewMode, items, isLoading, pagination, page, setPage, setIsAddModalOpen } = view;

  const columns = getComplianceColumns(view);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Indian CA Compliance Management"
        subtitle="Track GST Returns, Income Tax Audit (Form 3CD), TDS, ROC/MCA, PF/ESI, and Statutory Audit Due Dates"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4"  />
              <span>Add Custom Filing</span>
            </button>
          </div>
        }
      />

      {/* Top Metrics */}
      <ComplianceStats {...view} />

      {/* Statutory Presets Generator Bar */}
      <PresetsGenerator {...view} />

      {/* Filter & View Mode Bar */}
      <ComplianceFilters {...view} />

      {/* VIEW 1: COMPLIANCE CALENDAR GRID */}
      {viewMode === 'calendar' && <ComplianceCalendar {...view} />}

      {/* VIEW 2: MASTER TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <DataTable columns={columns} data={items} isLoading={isLoading} />
        </div>
      )}

      {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          totalRecords={pagination.totalRecords}
          limit={12}
          onPageChange={setPage}
        />
      )}

      {/* Convert Compliance to Task Modal */}
      <ConvertToTaskModal {...view} />

      {/* Add Custom Compliance Modal */}
      <AddComplianceModal {...view} />
    </div>
  );
};
