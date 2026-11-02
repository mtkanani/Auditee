import { useState, useMemo } from 'react';
import { useAttendanceLogs } from '../../../queries/useAttendance';
import { useFirmUsers } from '../../../queries/useLookups';
import { useDebounce } from '../../../hooks/useDebounce';
import { useAuth } from '../../../context/AuthContext';

export const useAttendancePage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'FIRM_ADMIN' || user?.role === 'ADMIN';

  const [isGeofenceModalOpen, setIsGeofenceModalOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [selectedUser, setSelectedUser] = useState('');
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const { data: users = [] } = useFirmUsers({ limit: 100 }, { enabled: isAdmin });
  const { logs, isLoading, refetch } = useAttendanceLogs({
    month: selectedMonth,
    year: selectedYear,
    search: debouncedSearch,
    userId: selectedUser || undefined,
    isAdmin,
  });

  // Stats calculation
  const totalPresent = useMemo(() => logs.filter((l) => l.status === 'PRESENT').length, [logs]);
  const halfDays = useMemo(() => logs.filter((l) => l.status === 'HALF_DAY').length, [logs]);
  const totalHoursWorked = useMemo(() => logs.reduce((acc, curr) => acc + (curr.workingHours || 0), 0), [logs]);
  const avgHoursPerDay = useMemo(() => (logs.length > 0 ? (totalHoursWorked / logs.length).toFixed(1) : '0.0'), [logs, totalHoursWorked]);

  return {
    isAdmin,
    isGeofenceModalOpen, setIsGeofenceModalOpen,
    search, setSearch,
    selectedUser, setSelectedUser,
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    users, logs, isLoading, refetch,
    totalPresent, halfDays, totalHoursWorked, avgHoursPerDay,
  };
};
