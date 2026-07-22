import React, { useState, useEffect, useCallback } from 'react';
import {
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiLogIn,
  FiLogOut,
  FiLoader,
  FiCalendar,
  FiWifi,
  FiList,
} from 'react-icons/fi';
import { attendanceService } from '../../services/attendanceService';
import toast from 'react-hot-toast';

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
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
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

  const fetchStatus = useCallback(async () => {
    try {
      const res = await attendanceService.getTodayStatus();
      setStatus(res.data || res);
    } catch (err) {
      console.error('Attendance status error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

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
    setActionLoading(true);
    try {
      const coords = await getCoordinates();
      await attendanceService.checkIn({
        lat: coords.lat,
        lng: coords.lng,
        location: coords.lat
          ? `GPS (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
          : 'Web Verified Location',
      });
      toast.success('🟢 Checked In successfully!');
      fetchStatus();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const coords = await getCoordinates();
      const res = await attendanceService.checkOut({
        lat: coords.lat,
        lng: coords.lng,
        location: coords.lat
          ? `GPS (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
          : 'Web Verified Location',
      });
      const hrs = res?.data?.workingHours || res?.workingHours || 0;
      toast.success(`🔴 Checked Out! Session ended.`);
      fetchStatus();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  const hasOpenEntry = status?.hasOpenEntry;
  const entries = status?.entries || [];
  const totalHours = status?.totalWorkingHours || 0;

  // Status badge config
  const statusConfig = hasOpenEntry
    ? { label: 'Working', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', dot: 'bg-indigo-400 animate-pulse' }
    : entries.length > 0
    ? { label: 'Day Summary', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' }
    : { label: 'Not Checked In', color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700', dot: 'bg-slate-500' };

  return (
    <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-emerald-600/5 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/25">
            <FiClock className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 leading-none">Attendance</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
              <FiCalendar className="w-2.5 h-2.5" />
              {getTodayDate()}
            </p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          {statusConfig.label}
        </span>
      </div>

      {/* Live Clock */}
      <div className="text-center py-2">
        <p className="text-4xl font-black text-slate-100 tabular-nums tracking-tight leading-none">
          {currentTime}
        </p>
        {hasOpenEntry && (
          <p className="text-xs text-indigo-400 font-bold mt-1.5 tabular-nums">
            ⏱ Session: {getLiveSessionTime()}
          </p>
        )}
        {!hasOpenEntry && totalHours > 0 && (
          <p className="text-xs text-emerald-400 font-bold mt-1.5">
            ✅ Total Today: {formatDuration(totalHours)}
          </p>
        )}
      </div>

      {/* Action Button */}
      {loading ? (
        <div className="flex items-center justify-center py-2">
          <FiLoader className="w-5 h-5 text-indigo-400 animate-spin" />
        </div>
      ) : hasOpenEntry ? (
        <button
          onClick={handleCheckOut}
          disabled={actionLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-rose-600/25 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {actionLoading ? (
            <><FiLoader className="w-4 h-4 animate-spin" /> Getting location...</>
          ) : (
            <><FiLogOut className="w-4 h-4" /> Check Out</>
          )}
        </button>
      ) : (
        <button
          onClick={handleCheckIn}
          disabled={actionLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {actionLoading ? (
            <><FiLoader className="w-4 h-4 animate-spin" /> Getting location...</>
          ) : (
            <><FiMapPin className="w-3.5 h-3.5" /><FiLogIn className="w-4 h-4" /> Check In with GPS</>
          )}
        </button>
      )}

      {/* Today's Punch Log */}
      {entries.length > 0 && (
        <div className="border-t border-slate-800 pt-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <FiList className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Today's Punches ({entries.length})
            </span>
          </div>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {entries.map((entry, i) => {
              const isOpen = !entry.checkOutTime;
              const dur = isOpen
                ? Math.max(0, (Date.now() - new Date(entry.checkInTime).getTime()) / 3600000)
                : entry.durationHours || 0;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                    isOpen
                      ? 'bg-indigo-500/10 border-indigo-500/20'
                      : 'bg-slate-800/50 border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isOpen ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400'}`} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400">#{i + 1}</span>
                        <span className="font-bold text-emerald-400">{formatTime(entry.checkInTime)}</span>
                        <span className="text-slate-600">→</span>
                        <span className={`font-bold ${isOpen ? 'text-indigo-400' : 'text-rose-400'}`}>
                          {isOpen ? 'Active' : formatTime(entry.checkOutTime)}
                        </span>
                      </div>
                      {entry.checkInLocation && (
                        <p className="text-[9px] text-slate-600 mt-0.5 truncate max-w-[140px]">
                          <FiMapPin className="inline w-2 h-2 mr-0.5" />
                          {entry.checkInLocation}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] font-extrabold ${isOpen ? 'text-indigo-300' : 'text-slate-300'}`}>
                      {formatDuration(dur)}
                    </span>
                    {isOpen && (
                      <p className="text-[8px] text-indigo-400/70">running</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day Total Summary */}
          <div className="mt-2.5 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-500">Total Working Hours</span>
            <span className="text-sm font-extrabold text-emerald-400">{formatDuration(totalHours)}</span>
          </div>
        </div>
      )}

      {/* GPS footer */}
      <div className="flex items-center justify-center gap-1 text-[9px] text-slate-700">
        <FiWifi className="w-2.5 h-2.5" />
        <span>GPS-verified attendance · Multiple punches supported</span>
      </div>
    </div>
  );
};
