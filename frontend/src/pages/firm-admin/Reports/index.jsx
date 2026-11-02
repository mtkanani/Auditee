import React, { useState, useEffect, useMemo } from 'react';
import { useReportOverview, useReportData, useGenerateCustomReport, useDownloadReportCSV } from '../../../queries/useReports';
import { useFirmUsers, useFirmClients } from '../../../queries/useLookups';
import { useDebounce } from '../../../hooks/useDebounce';
import { allTabs } from './constants';
import { ReportsHeader } from './ReportsHeader';
import { KpiCards } from './KpiCards';
import { ReportTabs } from './ReportTabs';
import { ReportFilters } from './ReportFilters';
import { OverviewPanel } from './OverviewPanel';
import { ReportTable } from './ReportTable';
import { CustomReportBuilder } from './CustomReportBuilder';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [customReportData, setCustomReportData] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters
  const [dateRange, setDateRange] = useState('this_month');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Dropdown filter lookups via React Query
  const { data: employees = [] } = useFirmUsers({ limit: 200 });
  const { data: clients = [] } = useFirmClients({ limit: 200 });

  // Custom Report Builder state
  const [customEntity, setCustomEntity] = useState('tasks');
  const [customFields, setCustomFields] = useState(['id', 'taskCode', 'title', 'status', 'priority', 'clientName', 'assignees']);

  // React Query hooks for reports
  const { summary, isLoading: isOverviewLoading } = useReportOverview({
    enabled: activeTab === 'overview',
  });

  const reportParams = useMemo(() => ({
    dateRange,
    employeeId: selectedEmployee,
    clientId: selectedClient,
    status: selectedStatus,
    search: debouncedSearchQuery,
  }), [dateRange, selectedEmployee, selectedClient, selectedStatus, debouncedSearchQuery]);

  const { reportData = [], isLoading: isReportLoading, refetch: refetchReport } = useReportData(
    activeTab,
    reportParams,
    { enabled: activeTab !== 'overview' && activeTab !== 'custom' }
  );

  const generateCustomReportMutation = useGenerateCustomReport();
  const downloadReportCSVMutation = useDownloadReportCSV();

  const loading = activeTab === 'overview' ? isOverviewLoading : (activeTab === 'custom' ? false : isReportLoading);
  const customLoading = generateCustomReportMutation.isPending;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, dateRange, selectedEmployee, selectedClient, selectedStatus, debouncedSearchQuery]);

  const handleRunCustomReport = async () => {
    try {
      const config = {
        entity: customEntity,
        selectedFields: customFields,
        dateRange,
        status: selectedStatus,
      };
      const res = await generateCustomReportMutation.mutateAsync(config);
      setCustomReportData(res?.data || []);
    } catch {
      // toast error handled in useGenerateCustomReport hook
    }
  };

  const handleExportCSV = async () => {
    try {
      if (activeTab === 'custom') {
        const config = {
          entity: customEntity,
          selectedFields: customFields,
          dateRange,
          status: selectedStatus,
        };
        await downloadReportCSVMutation.mutateAsync({ reportType: 'custom', params: {}, customConfig: config });
      } else {
        const params = {
          dateRange,
          employeeId: selectedEmployee,
          clientId: selectedClient,
          status: selectedStatus,
        };
        await downloadReportCSVMutation.mutateAsync({ reportType: activeTab, params });
      }
    } catch {
      // toast error handled in useDownloadReportCSV hook
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetFilters = () => {
    setDateRange('this_month');
    setSelectedEmployee('');
    setSelectedClient('');
    setSelectedStatus('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((activeTab === 'custom' ? customReportData.length : reportData.length) / rowsPerPage) || 1;
  const paginatedData = (activeTab === 'custom' ? customReportData : reportData).slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="space-y-6 pb-8">
      <ReportsHeader onPrint={handlePrint} onExportCSV={handleExportCSV} />

      {summary && <KpiCards summary={summary} />}

      <ReportTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {activeTab !== 'overview' && activeTab !== 'custom' && (
        <ReportFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={setSelectedEmployee}
          employees={employees}
          selectedClient={selectedClient}
          onClientChange={setSelectedClient}
          clients={clients}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onReset={resetFilters}
          onApply={refetchReport}
        />
      )}

      {loading ? (
        <div className="space-y-4" aria-busy="true" aria-label="Loading report">
          <div className="h-12 rounded-2xl bg-hover animate-pulse" />
          <div className="h-72 rounded-2xl bg-hover animate-pulse" />
        </div>
      ) : (
        <>
          {activeTab === 'overview' && <OverviewPanel summary={summary} />}

          {activeTab !== 'overview' && activeTab !== 'custom' && (
            <ReportTable
              title={allTabs.find((t) => t.id === activeTab)?.label}
              subtitle={`Total ${reportData.length} records matching parameters`}
              data={reportData}
              paginatedData={paginatedData}
              totalEntries={reportData.length}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          {activeTab === 'custom' && (
            <CustomReportBuilder
              customEntity={customEntity}
              onEntityChange={setCustomEntity}
              customFields={customFields}
              onFieldsChange={setCustomFields}
              onRunCustomReport={handleRunCustomReport}
              customLoading={customLoading}
              customReportData={customReportData}
              onExportCSV={handleExportCSV}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Reports;
