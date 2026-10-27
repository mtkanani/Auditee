import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import { ApplyLeaveModal } from '../../../components/leave/ApplyLeaveModal';
import { ConfigureLeavePolicyModal } from '../../../components/leave/ConfigureLeavePolicyModal';
import { AdjustEmployeeLeaveModal } from '../../../components/leave/AdjustEmployeeLeaveModal';
import { Plus, Settings, SlidersVertical } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management System 🌴"
        subtitle="Apply for leave, track Casual/Sick/Earned Leave balances, configure custom firm quotas, and review applications"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && (
              <>
                <button
                  onClick={() => setIsPolicyModalOpen(true)}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 shadow-lg flex items-center gap-1.5 transition-all"
                >
                  <Settings className="w-4 h-4 text-indigo-400"  />
                  <span>Configure Policy</span>
                </button>
                <button
                  onClick={() => setIsAdjustModalOpen(true)}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 shadow-lg flex items-center gap-1.5 transition-all"
                >
                  <SlidersVertical className="w-4 h-4 text-emerald-400"  />
                  <span>Adjust Employee Quotas</span>
                </button>
              </>
            )}
            {!isAdmin && (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4"  />
                <span>Apply for Leave</span>
              </button>
            )}
          </div>
        }
      />

      {/* Quota View Mode Switcher Header */}
      <QuotaModeBar {...view} />

      {/* Top Metrics / Quotas */}
      <LeaveQuotaStats {...view} />

      {/* View Toggle Bar */}
      <LeaveViewTabs {...view} />

      {/* TAB 1: PENDING INBOX (ADMIN ONLY) */}
      {isAdmin && activeTab === 'pending' && <PendingInbox {...view} columns={columns} />}

      {/* TAB 2: ALL FIRM LEAVES (ADMIN ONLY) */}
      {isAdmin && activeTab === 'all_firm' && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <DataTable columns={columns} data={allFirmRequests} isLoading={isLoading} />
        </div>
      )}

      {/* TAB 3: MY PERSONAL LEAVES */}
      {activeTab === 'my_leaves' && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <DataTable columns={columns} data={myLeaveData.requests || []} isLoading={isLoading} />
        </div>
      )}

      {/* TAB 4: LEAVE CALENDAR GRID */}
      {activeTab === 'calendar' && <LeaveCalendarGrid {...view} />}

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      {/* Configure Firm Leave Policy Modal */}
      <ConfigureLeavePolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        currentPolicy={myLeaveData.policy}
      />

      {/* Adjust Employee Leave Balance Modal */}
      <AdjustEmployeeLeaveModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        employeeBalances={employeeBalances}
      />
    </div>
  );
};
