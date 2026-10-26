import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Clock } from 'lucide-react';
import { useMyLeaveData, useApplyLeave } from '../../queries/useLeave';
import toast from 'react-hot-toast';

export const ApplyLeaveModal = ({ isOpen, onClose, onSuccess }) => {
  const [leaveType, setLeaveType] = useState('CASUAL_LEAVE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const { data: myLeaveData } = useMyLeaveData({ enabled: isOpen });
  const balance = myLeaveData?.balance;
  const applyLeaveMutation = useApplyLeave();

  useEffect(() => {
    if (isOpen) {
      // Default start/end date: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isoTomorrow = tomorrow.toISOString().split('T')[0];
      setStartDate(isoTomorrow);
      setEndDate(isoTomorrow);
    }
  }, [isOpen]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (e < s) return 0;
    const diffTime = Math.abs(e - s);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const daysCount = calculateDays();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      toast.error('Start date, end date, and reason are required');
      return;
    }

    if (daysCount <= 0) {
      toast.error('End date cannot be before start date');
      return;
    }

    applyLeaveMutation.mutate(
      {
        leaveType,
        startDate,
        endDate,
        totalDays: daysCount,
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          toast.success('🌴 Leave application submitted successfully!');
          onClose();
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🌴 Apply for Employee Leave">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Leave Balances Quick Cards */}
        {balance && (
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center shadow-inner">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Casual Leave</span>
              <span className="text-sm font-black text-indigo-400">
                {(balance.casualLeave - balance.casualLeaveUsed).toFixed(1)} / {balance.casualLeave} Days
              </span>
            </div>

            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Sick Leave</span>
              <span className="text-sm font-black text-purple-400">
                {(balance.sickLeave - balance.sickLeaveUsed).toFixed(1)} / {balance.sickLeave} Days
              </span>
            </div>

            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Earned Leave</span>
              <span className="text-sm font-black text-emerald-400">
                {(balance.earnedLeave - balance.earnedLeaveUsed).toFixed(1)} / {balance.earnedLeave} Days
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5">Select Leave Type *</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-bold focus:outline-none focus:border-indigo-500 transition-all"
          >
            <option value="CASUAL_LEAVE">Casual Leave (CL)</option>
            <option value="SICK_LEAVE">Sick Leave (SL)</option>
            <option value="EARNED_LEAVE">Earned Leave (EL)</option>
            <option value="UNPAID_LEAVE">Unpaid Leave (LWP)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Start Date *</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">End Date *</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Calculated Days Badge */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
            <Clock size="1em" className="text-indigo-400"  /> Calculated Duration:
          </span>
          <span className="text-xs font-black text-amber-400">
            {daysCount} Day(s) Requested
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5">Reason for Leave *</label>
          <textarea
            required
            rows={3}
            placeholder="Specify reason for leave application..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={applyLeaveMutation.isPending}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg mt-2 transition-all flex items-center justify-center gap-2"
        >
          <span>{applyLeaveMutation.isPending ? 'Submitting Application...' : 'Submit Leave Application'}</span>
        </button>
      </form>
    </Modal>
  );
};
