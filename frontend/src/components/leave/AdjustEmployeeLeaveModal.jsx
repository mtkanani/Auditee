import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { FiUser, FiUserCheck, FiSave } from 'react-icons/fi';
import { leaveService } from '../../services/leaveService';
import toast from 'react-hot-toast';

export const AdjustEmployeeLeaveModal = ({ isOpen, onClose, employeeBalances, onBalanceAdjusted }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [casualLeave, setCasualLeave] = useState(12);
  const [sickLeave, setSickLeave] = useState(10);
  const [earnedLeave, setEarnedLeave] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBalance = employeeBalances.find((b) => b.userId === parseInt(selectedUserId, 10));

  useEffect(() => {
    if (selectedBalance) {
      setCasualLeave(selectedBalance.casualLeave);
      setSickLeave(selectedBalance.sickLeave);
      setEarnedLeave(selectedBalance.earnedLeave);
    }
  }, [selectedUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Please select an employee');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        casualLeave: parseFloat(casualLeave),
        sickLeave: parseFloat(sickLeave),
        earnedLeave: parseFloat(earnedLeave),
      };

      await leaveService.updateEmployeeLeaveBalance(selectedUserId, payload);
      toast.success('Employee custom leave quota adjusted successfully!');
      if (onBalanceAdjusted) onBalanceAdjusted();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to adjust employee leave quota');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customize Employee Leave Quotas ✏️">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
          <p className="font-bold text-indigo-400">Increase or Decrease Quota per Employee</p>
          <p className="text-slate-400">
            Grant extra leaves or decrease leave quotas for specific staff members (e.g. senior auditors, interns, or special allowances).
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5">Select Employee Staff Member</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Choose Employee...</option>
            {employeeBalances.map((b) => (
              <option key={b.userId} value={b.userId}>
                {b.user?.firstName} {b.user?.lastName} ({b.user?.designation || 'Staff'}) — CL: {b.casualLeave}, SL: {b.sickLeave}, EL: {b.earnedLeave}
              </option>
            ))}
          </select>
        </div>

        {selectedBalance && (
          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Casual Leave (CL) Limit</span>
                <span className="text-[10px] text-amber-400">Used: {selectedBalance.casualLeaveUsed} Days</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0"
                value={casualLeave}
                onChange={(e) => setCasualLeave(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Sick Leave (SL) Limit</span>
                <span className="text-[10px] text-amber-400">Used: {selectedBalance.sickLeaveUsed} Days</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0"
                value={sickLeave}
                onChange={(e) => setSickLeave(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Earned Leave (EL) Limit</span>
                <span className="text-[10px] text-amber-400">Used: {selectedBalance.earnedLeaveUsed} Days</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0"
                value={earnedLeave}
                onChange={(e) => setEarnedLeave(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !selectedUserId}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
        >
          <FiSave className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving Adjustments...' : 'Apply Custom Quota Adjustments'}</span>
        </button>
      </form>
    </Modal>
  );
};
