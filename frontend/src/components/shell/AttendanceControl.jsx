import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, MapPin } from 'lucide-react';
import { useTodayAttendance, useCheckIn, useCheckOut } from '../../queries/useAttendance';
import { useConfirm } from '../common/ConfirmProvider';
import { Button } from '../ui';
import { cn } from '../../lib/cn';

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

const formatHours = (h) => {
  const totalMinutes = Math.max(0, Math.floor((h || 0) * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours ? `${hours}h ${String(minutes).padStart(2, '0')}m` : `${minutes}m`;
};

/** Hours worked today, ticking while checked in (the API's figure plus time since it was fetched). */
const useLiveHours = (status, fetchedAt) => {
  const [now, setNow] = useState(() => Date.now());
  const open = Boolean(status?.hasOpenEntry);
  useEffect(() => {
    if (!open) return undefined;
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [open]);
  const base = Number(status?.workingHours) || 0;
  return open && fetchedAt ? base + (now - fetchedAt) / 3_600_000 : base;
};

/**
 * Check in / check out for staff, in the top bar. Three states: not checked in, checked in (live
 * timer and a clear Check out button), checked out (today's total and Check in again, since a day
 * can have several check-ins). compact: icon buttons for phones.
 */
export const AttendanceControl = ({ compact = false }) => {
  const { status, dataUpdatedAt } = useTodayAttendance({ enabled: true });
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();
  const confirm = useConfirm();
  const busy = checkInMutation.isPending || checkOutMutation.isPending;
  const hours = useLiveHours(status, dataUpdatedAt);

  const checkIn = async () => {
    try {
      await checkInMutation.mutateAsync(await withLocation());
    } catch {
      // toast handled in mutation
    }
  };

  const checkOut = async () => {
    const ok = await confirm({
      title: 'Check out now?',
      message: `You've worked ${formatHours(hours)} today. You can check in again later if you need to.`,
      confirmText: 'Check out',
      isDanger: false,
    });
    if (!ok) return;
    try {
      await checkOutMutation.mutateAsync(await withLocation());
    } catch {
      // toast handled in mutation
    }
  };

  const open = Boolean(status?.hasOpenEntry);
  const done = Boolean(status?.isCheckedIn) && !open;

  if (compact) {
    return open ? (
      <Button size="icon-sm" variant="soft" icon={LogOut} loading={busy} onClick={checkOut} aria-label={`Check out (${formatHours(hours)} today)`} title="Check out" />
    ) : (
      <Button size="icon-sm" variant="soft" icon={done ? LogIn : MapPin} loading={busy} onClick={checkIn} aria-label={done ? 'Check in again' : 'Check in'} title={done ? 'Check in again' : 'Check in'} />
    );
  }

  if (open) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-2 h-8 px-3 rounded-lg bg-success-soft text-success text-xs font-medium" title="Checked in">
          <span className="relative flex w-2 h-2" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
            <span className="relative w-2 h-2 rounded-full bg-success" />
          </span>
          <span>Checked in</span>
          <span className="tabular-nums text-success/80" aria-label={`${formatHours(hours)} worked today`}>
            {formatHours(hours)}
          </span>
        </span>
        <Button size="sm" variant="secondary" icon={LogOut} loading={busy} onClick={checkOut}>
          Check out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {done && (
        <span className={cn('inline-flex items-center h-8 px-3 rounded-lg bg-hover text-xs font-medium text-muted tabular-nums')}>
          Out · {formatHours(hours)} today
        </span>
      )}
      <Button size="sm" variant="soft" icon={done ? LogIn : MapPin} loading={busy} onClick={checkIn} title="Check in with GPS verification">
        {done ? 'Check in again' : 'Check in'}
      </Button>
    </div>
  );
};
