import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { attendanceService } from '../services/attendanceService';
import { attendanceKeys, dashboardKeys } from './keys';
import toast from 'react-hot-toast';

// ----------------------------------------------------
// QUERIES
// ----------------------------------------------------

export const useTodayAttendance = ({ enabled = true } = {}) => {
  const query = useQuery({
    queryKey: attendanceKeys.today(),
    queryFn: async () => {
      const res = await attendanceService.getTodayStatus();
      return res.data || res;
    },
    enabled,
    refetchInterval: 60_000,
  });

  return {
    status: query.data,
    ...query,
  };
};

export const useAttendanceLogs = ({ month, year, search, userId, isAdmin }) => {
  const query = useQuery({
    queryKey: isAdmin
      ? attendanceKeys.firmReport({ month, year, search, userId })
      : attendanceKeys.myLogs({ month, year }),
    queryFn: async () => {
      if (isAdmin) {
        const res = await attendanceService.getFirmReport({
          month,
          year,
          search,
          userId: userId || undefined,
        });
        return res.data || [];
      } else {
        const res = await attendanceService.getMyLogs({ month, year });
        return res.data || [];
      }
    },
    placeholderData: keepPreviousData,
  });

  return {
    logs: Array.isArray(query.data) ? query.data : [],
    ...query,
  };
};

export const useGeofenceSettings = ({ enabled = true } = {}) => {
  const query = useQuery({
    queryKey: attendanceKeys.geofence(),
    queryFn: async () => {
      const res = await attendanceService.getGeofenceSettings();
      return res.data || res;
    },
    enabled,
  });

  return {
    settings: query.data,
    ...query,
  };
};

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => attendanceService.checkIn(data),
    onSuccess: () => {
      toast.success('🟢 Checked In successfully with GPS location!');
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Check-in failed');
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => attendanceService.checkOut(data),
    onSuccess: (res) => {
      const hrs = res?.data?.workingHours || res?.workingHours || 0;
      toast.success(hrs ? `🔴 Checked Out! Total Working Hours: ${hrs} hrs` : '🔴 Checked Out! Session ended.');
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Check-out failed');
    },
  });
};

export const useUpdateGeofenceSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => attendanceService.updateGeofenceSettings(payload),
    onSuccess: () => {
      toast.success('Office GPS Geofence settings saved successfully!');
      queryClient.invalidateQueries({ queryKey: attendanceKeys.geofence() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save geofence settings');
    },
  });
};
