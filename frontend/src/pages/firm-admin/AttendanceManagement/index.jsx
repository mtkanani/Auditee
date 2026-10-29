import React from 'react';
import { CalendarX, CircleCheckBig, Clock, MapPin, TriangleAlert, UserCheck } from 'lucide-react';
import { ConfigureGeofenceModal } from '../../../components/attendance/ConfigureGeofenceModal';
import { EmptyState } from '../../../components/common/EmptyState';
import { Button, PageHeader, StatCard, Table } from '../../../components/ui';
import { useAttendancePage } from './useAttendancePage';
import { getAttendanceColumns } from './attendanceColumns';
import { AttendanceFilters } from './AttendanceFilters';

export const AttendanceManagement = () => {
  const view = useAttendancePage();
  const { isAdmin, isGeofenceModalOpen, setIsGeofenceModalOpen, logs, isLoading, refetch, totalPresent, halfDays, totalHoursWorked, avgHoursPerDay } = view;

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title={isAdmin ? 'Attendance' : 'My attendance'}
        description={
          isAdmin
            ? "Daily check-ins and check-outs with location, and everyone's working hours for the month."
            : 'Your check-ins, check-outs and working hours for the month.'
        }
        actions={
          isAdmin && (
            <Button icon={MapPin} onClick={() => setIsGeofenceModalOpen(true)}>
              Office location
            </Button>
          )
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Present days" value={totalPresent} icon={CircleCheckBig} tone="success" />
        <StatCard label="Half days" value={halfDays} icon={TriangleAlert} tone={halfDays > 0 ? 'warning' : 'neutral'} />
        <StatCard label="Hours worked" value={`${totalHoursWorked.toFixed(1)} h`} icon={Clock} />
        <StatCard label="Average a day" value={`${avgHoursPerDay} h`} icon={UserCheck} tone="neutral" />
      </div>

      <AttendanceFilters {...view} />

      <Table
        columns={getAttendanceColumns(view)}
        data={logs}
        isLoading={isLoading}
        emptyState={<EmptyState icon={CalendarX} title="No attendance this month" description="Check-ins show up here as soon as someone checks in." />}
      />

      <ConfigureGeofenceModal isOpen={isGeofenceModalOpen} onClose={() => setIsGeofenceModalOpen(false)} onSaved={refetch} />
    </div>
  );
};
