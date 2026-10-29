import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, LogIn, LogOut, MapPin } from 'lucide-react';
import { Badge, Button } from '../ui';
import { cn } from '../../lib/cn';
import { useTodayAttendance, useCheckIn, useCheckOut } from '../../queries/useAttendance';

const getTimeString = () =>
  new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const formatTime = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const getTodayDate = () =>
  new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const formatDuration = (hours) => {
  if (!hours) return '0m';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const AttendanceWidget = () => {
  const { status, isLoading: loading } = useTodayAttendance();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();
  const actionLoading = checkInMutation.isPending || checkOutMutation.isPending;

  const [currentTime, setCurrentTime] = useState(getTimeString());
  const [, setTick] = useState(0);

  // Live clock tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getTimeString());
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate live running time for the open session
  const getLiveSessionTime = () => {
    if (!status?.openEntry?.checkInTime) return '00:00:00';
    const diffMs = Date.now() - new Date(status.openEntry.checkInTime).getTime();
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    const s = Math.floor((diffMs % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getCoordinates = () =>
    new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve({ lat: null, lng: null }),
          { timeout: 5000 }
        );
      } else {
        resolve({ lat: null, lng: null });
      }
    });

  const handleCheckIn = async () => {
    try {
      const coords = await getCoordinates();
      await checkInMutation.mutateAsync({
        lat: coords.lat,
        lng: coords.lng,
        location: coords.lat
          ? `GPS (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
          : 'Web Verified Location',
      });
    } catch {
      // toast handled in mutation
    }
  };

  const handleCheckOut = async () => {
    try {
      const coords = await getCoordinates();
      await checkOutMutation.mutateAsync({
        lat: coords.lat,
        lng: coords.lng,
        location: coords.lat
          ? `GPS (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
          : 'Web Verified Location',
      });
    } catch {
      // toast handled in mutation
    }
  };

  const hasOpenEntry = status?.hasOpenEntry;
  const entries = status?.entries || [];
  const totalHours = status?.totalWorkingHours || 0;

  const state = hasOpenEntry
    ? { label: 'Working', tone: 'accent' }
    : entries.length > 0
      ? { label: 'Done for now', tone: 'success' }
      : { label: 'Not checked in', tone: 'neutral' };

  return (
    <section aria-label="Attendance" className="rounded-2xl border border-line bg-surface shadow-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-accent-soft text-accent-fg shrink-0">
            <Clock className="w-4 h-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-fg">Attendance</h3>
            <p className="text-xs text-subtle flex items-center gap-1 truncate">
              <CalendarDays className="w-3 h-3 shrink-0" aria-hidden="true" />
              {getTodayDate()}
            </p>
          </div>
        </div>
        <Badge tone={state.tone} dot className={hasOpenEntry ? '[&>span:first-child]:animate-pulse' : undefined}>{state.label}</Badge>
      </div>

      <div className="text-center py-1">
        <p className="text-4xl font-semibold text-fg tabular-nums tracking-tight" aria-label={`Time now ${currentTime}`}>{currentTime}</p>
        {hasOpenEntry && <p className="text-sm text-accent-fg font-medium mt-1.5 tabular-nums">This session {getLiveSessionTime()}</p>}
        {!hasOpenEntry && totalHours > 0 && <p className="text-sm text-success font-medium mt-1.5">Today so far {formatDuration(totalHours)}</p>}
      </div>

      {loading ? (
        <div className="h-11 rounded-xl bg-hover animate-pulse" aria-hidden="true" />
      ) : hasOpenEntry ? (
        <Button size="lg" variant="danger" icon={LogOut} loading={actionLoading} onClick={handleCheckOut} className="w-full">
          {actionLoading ? 'Getting location…' : 'Check out'}
        </Button>
      ) : (
        <Button size="lg" variant="primary" icon={LogIn} loading={actionLoading} onClick={handleCheckIn} className="w-full">
          {actionLoading ? 'Getting location…' : 'Check in'}
        </Button>
      )}

      {entries.length > 0 && (
        <div className="border-t border-line pt-3 space-y-2">
          <p className="text-xs text-subtle">Today ({entries.length} {entries.length === 1 ? 'check-in' : 'check-ins'})</p>
          <ol className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {entries.map((entry, i) => {
              const isOpen = !entry.checkOutTime;
              const dur = isOpen
                ? Math.max(0, (Date.now() - new Date(entry.checkInTime).getTime()) / 3600000)
                : entry.durationHours || 0;
              return (
                <li key={entry.id} className={cn('flex items-center justify-between gap-3 px-3 py-2 rounded-xl border text-sm', isOpen ? 'border-accent/30 bg-accent-soft/40' : 'border-line')}>
                  <div className="min-w-0">
                    <p className="tabular-nums text-fg">
                      <span className="text-subtle text-xs mr-1.5">#{i + 1}</span>
                      {formatTime(entry.checkInTime)} <span className="text-subtle">→</span> {isOpen ? <span className="text-accent-fg font-medium">now</span> : formatTime(entry.checkOutTime)}
                    </p>
                    {entry.checkInLocation && (
                      <p className="flex items-center gap-1 text-xs text-subtle truncate max-w-[180px]">
                        <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{entry.checkInLocation}</span>
                      </p>
                    )}
                  </div>
                  <span className={cn('text-sm font-medium tabular-nums shrink-0', isOpen ? 'text-accent-fg' : 'text-fg')}>{formatDuration(dur)}</span>
                </li>
              );
            })}
          </ol>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-sunken/60 text-sm">
            <span className="text-muted">Total today</span>
            <span className="font-semibold text-fg tabular-nums">{formatDuration(totalHours)}</span>
          </div>
        </div>
      )}

      <p className="flex items-center justify-center gap-1.5 text-xs text-subtle">
        <MapPin className="w-3 h-3" aria-hidden="true" />
        {status?.geofence?.geofenceEnabled
          ? `Check-in only within ${status.geofence.geofenceRadiusMeters} m of the office`
          : 'Location is recorded with each check-in'}
      </p>
    </section>
  );
};
