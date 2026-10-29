import React from 'react';
import { Plus } from 'lucide-react';
import { Pagination } from '../../../components/common/Pagination';
import { Button, PageHeader, Table } from '../../../components/ui';
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
  const pager =
    pagination?.totalPages > 1 ? (
      <Pagination currentPage={page} totalPages={pagination.totalPages} totalRecords={pagination.totalRecords} limit={12} onPageChange={setPage} />
    ) : null;

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Compliance"
        description="GST returns, TDS, tax audit, ROC and PF/ESI due dates for every client."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add filing
          </Button>
        }
      />

      <ComplianceStats {...view} />

      <PresetsGenerator {...view} />

      <ComplianceFilters {...view} />

      {viewMode === 'calendar' && (
        <>
          <ComplianceCalendar {...view} />
          {pager && <div className="rounded-2xl border border-line bg-surface overflow-hidden">{pager}</div>}
        </>
      )}

      {viewMode === 'table' && <Table columns={columns} data={items} isLoading={isLoading} footer={pager} />}

      <ConvertToTaskModal {...view} />

      <AddComplianceModal {...view} />
    </div>
  );
};
