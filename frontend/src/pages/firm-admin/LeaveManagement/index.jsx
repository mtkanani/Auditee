import React from 'react';
import { CalendarPlus, CalendarX, Settings, SlidersVertical } from 'lucide-react';
import { ApplyLeaveModal } from '../../../components/leave/ApplyLeaveModal';
import { ConfigureLeavePolicyModal } from '../../../components/leave/ConfigureLeavePolicyModal';
import { AdjustEmployeeLeaveModal } from '../../../components/leave/AdjustEmployeeLeaveModal';
import { EmptyState } from '../../../components/common/EmptyState';
import { Button, PageHeader, Table } from '../../../components/ui';
import { useLeaveManagement } from './useLeaveManagement';
import { getLeaveColumns } from './leaveColumns';
import { QuotaModeBar } from './QuotaModeBar';
import { LeaveQuotaStats } from './LeaveQuotaStats';
import { LeaveViewTabs } from './LeaveViewTabs';
import { PendingInbox } from './PendingInbox';
import { LeaveCalendarGrid } from './LeaveCalendarGrid';

export const LeaveManagement = () => {
  const view = useLeaveManagement();
  const {
    isAdmin,
    activeTab,
    setIsApplyModalOpen,
    setIsPolicyModalOpen,
    setIsAdjustModalOpen,
    isApplyModalOpen,
    isPolicyModalOpen,
    isAdjustModalOpen,
    allFirmRequests,
    myLeaveData,
    employeeBalances,
    isLoading,
  } = view;

  const columns = getLeaveColumns(view);
  const noRequests = (
    <EmptyState
      icon={CalendarX}
      title="No leave requests"
      description={activeTab === 'my_leaves' && !isAdmin ? 'Requests you apply for will show up here.' : 'Leave requests will show up here.'}
    />
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Leave"
        description={
          isAdmin
            ? 'Review requests, see who is away, and set your firm’s casual, sick and earned leave quotas.'
            : 'Apply for leave and keep track of your casual, sick and earned leave balance.'
        }
        actions={
          isAdmin ? (
            <>
              <Button icon={Settings} onClick={() => setIsPolicyModalOpen(true)}>Leave policy</Button>
              <Button icon={SlidersVertical} onClick={() => setIsAdjustModalOpen(true)}>Adjust quotas</Button>
            </>
          ) : (
            <Button variant="primary" icon={CalendarPlus} onClick={() => setIsApplyModalOpen(true)}>Apply for leave</Button>
          )
        }
      />

      <section className="space-y-3">
        <QuotaModeBar {...view} />
        <LeaveQuotaStats {...view} />
      </section>

      <LeaveViewTabs {...view} />

      {isAdmin && activeTab === 'pending' && <PendingInbox {...view} />}

      {isAdmin && activeTab === 'all_firm' && (
        <Table columns={columns} data={allFirmRequests} isLoading={isLoading} emptyState={noRequests} />
      )}

      {activeTab === 'my_leaves' && (
        <Table columns={columns} data={myLeaveData.requests || []} isLoading={isLoading} emptyState={noRequests} />
      )}

      {activeTab === 'calendar' && <LeaveCalendarGrid {...view} />}

      <ApplyLeaveModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />

      <ConfigureLeavePolicyModal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} currentPolicy={myLeaveData.policy} />

      <AdjustEmployeeLeaveModal isOpen={isAdjustModalOpen} onClose={() => setIsAdjustModalOpen(false)} employeeBalances={employeeBalances} />
    </div>
  );
};
