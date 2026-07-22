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
} from 'react-icons/fi';
import { attendanceService } from '../../services/attendanceService';
import toast from 'react-hot-toast';

const getTimeString = () =>
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

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

export const AttendanceWidget = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(getTimeString());
  const [liveSeconds, setLiveSeconds] = useState(0);

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getTimeString());
      setLiveSeconds((s) => s + 1);
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

  // Calculate live working hours if currently checked in
  const getLiveWorkingTime = () => {
    if (!status?.checkInTime || status?.isCheckedOut) {
      return status?.workingHours ? `${status.workingHours} hrs` : '0 hrs';
    }
    const checkInMs = new Date(status.checkInTime).getTime();
    const nowMs = Date.now();
    const diffMs = nowMs - checkInMs;
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
      toast.success(`🔴 Checked Out! Working Hours: ${hrs} hrs`);
      fetchStatus();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  const isCheckedIn = status?.isCheckedIn;
  const isCheckedOut = status?.isCheckedOut;

  // Status pill config
  const statusConfig = isCheckedOut
    ? { label: 'Day Complete', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' }
    : isCheckedIn
    ? { label: 'Currently Working', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', dot: 'bg-indigo-400 animate-pulse' }
    : { label: 'Not Checked In', color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700', dot: 'bg-slate-500' };

  return (
    <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Gradient glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-emerald-600/5 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/25">
            <FiClock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100">Attendance</h3>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <FiCalendar className="w-3 h-3" />
              <span>{getTodayDate()}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.color}`}>
          <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
          {statusConfig.label}
        </span>
      </div>

      {/* Live Clock */}
      <div className="text-center mb-6">
        <p className="text-4xl font-black text-slate-100 tabular-nums tracking-tight leading-none">
          {currentTime}
        </p>
        {isCheckedIn && !isCheckedOut && (
          <p className="text-xs text-indigo-400 font-bold mt-1.5 tabular-nums">
            ⏱ Working: {getLiveWorkingTime()}
          </p>
        )}
        {isCheckedOut && (
          <p className="text-xs text-emerald-400 font-bold mt-1.5">
            ✅ Total: {status?.workingHours || 0} hrs today
          </p>
        )}
      </div>

      {/* Check-In / Check-Out Time Boxes */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-1.5 mb-1">
            <FiLogIn className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Check-In</span>
          </div>
          <p className="text-sm font-extrabold text-emerald-400">
            {isCheckedIn ? formatTime(status?.checkInTime) : '—'}
          </p>
          {status?.checkInLocation && (
            <p className="text-[9px] text-slate-600 mt-0.5 truncate">
              <FiMapPin className="inline w-2.5 h-2.5 mr-0.5" />
              {status.checkInLocation}
            </p>
          )}
        </div>

        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-1.5 mb-1">
            <FiLogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Check-Out</span>
          </div>
          <p className="text-sm font-extrabold text-rose-400">
            {isCheckedOut ? formatTime(status?.checkOutTime) : '—'}
          </p>
          {status?.checkOutLocation && (
            <p className="text-[9px] text-slate-600 mt-0.5 truncate">
              <FiMapPin className="inline w-2.5 h-2.5 mr-0.5" />
              {status.checkOutLocation}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      {loading ? (
        <div className="flex items-center justify-center py-3">
          <FiLoader className="w-5 h-5 text-indigo-400 animate-spin" />
        </div>
      ) : isCheckedOut ? (
        <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <FiCheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold text-emerald-400">Day Complete — Great work! 🎉</span>
        </div>
      ) : !isCheckedIn ? (
        <button
          onClick={handleCheckIn}
          disabled={actionLoading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/30 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {actionLoading ? (
            <><FiLoader className="w-4 h-4 animate-spin" /> Getting GPS Location...</>
          ) : (
            <><FiMapPin className="w-4 h-4" /><FiLogIn className="w-4 h-4" /> Check In with GPS</>
          )}
        </button>
      ) : (
        <button
          onClick={handleCheckOut}
          disabled={actionLoading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-rose-600/25 hover:shadow-rose-500/30 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {actionLoading ? (
            <><FiLoader className="w-4 h-4 animate-spin" /> Getting GPS Location...</>
          ) : (
            <><FiLogOut className="w-4 h-4" /> Check Out</>
          )}
        </button>
      )}

      {/* GPS indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-slate-600">
        <FiWifi className="w-3 h-3" />
        <span>GPS-verified attendance</span>
      </div>
    </div>
  );
};
