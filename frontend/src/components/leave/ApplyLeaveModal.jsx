import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { FiCalendar, FiFileText, FiZap, FiCheckCircle } from 'react-icons/fi';
import { leaveService } from '../../services/leaveService';
import toast from 'react-hot-toast';

export const ApplyLeaveModal = ({ isOpen, onClose, onSuccess }) => {
  const [balance, setBalance] = useState(null);
  const [leaveType, setLeaveType] = useState('CASUAL_LEAVE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      leaveService.getMyLeaveData().then((res) => {
        setBalance(res.data?.balance);
      });
      // Default start/end date: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isoTomorrow = tomorrow.toISOString().split('T')[0];
      setStartDate(isoTomorrow);
      setEndDate(isoTomorrow);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      toast.error('Start date, end date, and reason are required');
      return;
    }

    setIsLoading(true);
    try {
      await leaveService.applyLeave({
        leaveType,
        startDate,
        endDate,
        reason: reason.trim(),
      });
      toast.success('🌴 Leave application submitted successfully!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to submit leave application');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🌴 Apply for Leave">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Leave Balances Quick Card */}
        {balance && (
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Casual (CL)</span>
              <span className="text-xs font-black text-indigo-400">
                {(balance.casualLeave - balance.casualLeaveUsed).toFixed(1)} / {balance.casualLeave}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Sick (SL)</span>
              <span className="text-xs font-black text-purple-400">
                {(balance.sickLeave - balance.sickLeaveUsed).toFixed(1)} / {balance.sickLeave}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Earned (EL)</span>
              <span className="text-xs font-black text-emerald-400">
                {(balance.earnedLeave - balance.earnedLeaveUsed).toFixed(1)} / {balance.earnedLeave}
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Leave Type *</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-400 font-bold"
          >
            <option value="CASUAL_LEAVE">Casual Leave (CL)</option>
            <option value="SICK_LEAVE">Sick Leave (SL)</option>
            <option value="EARNED_LEAVE">Earned Leave (EL)</option>
            <option value="UNPAID_LEAVE">Unpaid Leave (LWP)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date *</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">End Date *</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Leave *</label>
          <textarea
            required
            rows={3}
            placeholder="Please specify reason for leave request..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg mt-2"
        >
          Submit Leave Request
        </button>
      </form>
    </Modal>
  );
};
