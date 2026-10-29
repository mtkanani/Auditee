import React from 'react';
import { Calendar, Inbox, List, User } from 'lucide-react';
import { FilterBar, Select, Tabs } from '../../../components/ui';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2026, i, 1).toLocaleString('default', { month: 'long' }),
}));
const YEARS = [2025, 2026, 2027].map((y) => ({ value: y, label: String(y) }));

export const LeaveViewTabs = ({
  isAdmin,
  activeTab,
  setActiveTab,
  pendingRequests,
  allFirmRequests,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) => (
  <FilterBar>
    <Tabs
      aria-label="Leave views"
      value={activeTab}
      onChange={setActiveTab}
      items={[
        ...(isAdmin
          ? [
              { value: 'pending', label: 'To review', icon: Inbox, count: pendingRequests.length },
              { value: 'all_firm', label: 'Everyone', icon: List, count: allFirmRequests.length },
            ]
          : []),
        { value: 'my_leaves', label: 'My leave', icon: User },
        { value: 'calendar', label: 'Calendar', icon: Calendar },
      ]}
    />

    {/* Month and year only drive the calendar view */}
    {activeTab === 'calendar' && (
      <div className="grid grid-cols-2 sm:flex gap-3 sm:ml-auto">
        <Select aria-label="Month" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))} options={MONTHS} className="sm:w-40" />
        <Select aria-label="Year" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))} options={YEARS} className="sm:w-28" />
      </div>
    )}
  </FilterBar>
);
