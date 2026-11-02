import React from 'react';
import { CircleCheckBig, MapPin } from 'lucide-react';
import { useTodayAttendance, useCheckIn, useCheckOut } from '../../queries/useAttendance';
import { Button } from '../ui';

// Best-effort GPS fix; resolves with nulls when unavailable or denied.
const getCoordinates = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({ lat: null, lng: null });
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve({ lat: null, lng: null })
    );
  });

const withLocation = async () => {
  const coords = await getCoordinates();
  return {
    lat: coords.lat,
    lng: coords.lng,
    location: coords.lat ? `GPS (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})` : 'Web Verified Location',
  };
};

/** Check in / working hours + check out / checked out, for staff roles. */
export const AttendanceControl = () => {
  const { status } = useTodayAttendance({ enabled: true });
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();
  const busy = checkInMutation.isPending || checkOutMutation.isPending;

  const run = (mutation) => async () => {
    try {
      await mutation.mutateAsync(await withLocation());
    } catch {
      // toast handled in mutation
    }
  };

  if (!status?.isCheckedIn) {
    return (
      <Button size="sm" variant="soft" icon={MapPin} loading={busy} onClick={run(checkInMutation)} title="Check in with GPS verification">
        Check in
      </Button>
    );
  }

  if (!status?.isCheckedOut) {
    return (
      <div className="flex items-center gap-2 h-8 pl-3 pr-1 rounded-lg bg-success-soft">
        <span className="relative flex w-2 h-2" aria-hidden="true">
          <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
          <span className="relative w-2 h-2 rounded-full bg-success" />
        </span>
        <span className="text-xs font-medium text-success tabular-nums">{status.workingHours || 0} h</span>
        <Button size="sm" variant="ghost" className="h-6 px-2" loading={busy} onClick={run(checkOutMutation)}>
          Check out
        </Button>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-hover text-xs font-medium text-muted">
      <CircleCheckBig className="w-3.5 h-3.5 text-success" aria-hidden="true" />
      Done · {status.workingHours || 0} h
    </span>
  );
};
