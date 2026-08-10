import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { FiSettings, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { leaveService } from '../../services/leaveService';
import toast from 'react-hot-toast';

export const ConfigureLeavePolicyModal = ({ isOpen, onClose, currentPolicy, onPolicyUpdated }) => {
  const [accrualMode, setAccrualMode] = useState('YEARLY');
  const [casualLeaveQuota, setCasualLeaveQuota] = useState(12);
  const [sickLeaveQuota, setSickLeaveQuota] = useState(10);
  const [earnedLeaveQuota, setEarnedLeaveQuota] = useState(15);
  const [perMonthCasual, setPerMonthCasual] = useState(1.0);
  const [perMonthSick, setPerMonthSick] = useState(0.83);
  const [perMonthEarned, setPerMonthEarned] = useState(1.25);
  const [updateAllBalances, setUpdateAllBalances] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentPolicy) {
      setAccrualMode(currentPolicy.accrualMode || 'YEARLY');
      setCasualLeaveQuota(currentPolicy.casualLeaveQuota ?? 12);
      setSickLeaveQuota(currentPolicy.sickLeaveQuota ?? 10);
      setEarnedLeaveQuota(currentPolicy.earnedLeaveQuota ?? 15);
      setPerMonthCasual(currentPolicy.perMonthCasual ?? 1.0);
      setPerMonthSick(currentPolicy.perMonthSick ?? 0.83);
      setPerMonthEarned(currentPolicy.perMonthEarned ?? 1.25);
    }
  }, [currentPolicy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        accrualMode,
        casualLeaveQuota: parseFloat(casualLeaveQuota),
        sickLeaveQuota: parseFloat(sickLeaveQuota),
        earnedLeaveQuota: parseFloat(earnedLeaveQuota),
        perMonthCasual: parseFloat(perMonthCasual),
        perMonthSick: parseFloat(perMonthSick),
        perMonthEarned: parseFloat(perMonthEarned),
        updateAllBalances,
      };

      await leaveService.updateLeavePolicy(payload);
      toast.success('Firm leave policy & custom quotas updated successfully!');
      if (onPolicyUpdated) onPolicyUpdated();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update leave policy');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-calculation handlers (Per Month <-> Per Year)
  const handleCasualQuotaChange = (val) => {
    setCasualLeaveQuota(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPerMonthCasual(parseFloat((num / 12).toFixed(2)));
    }
  };

  const handlePerMonthCasualChange = (val) => {
    setPerMonthCasual(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCasualLeaveQuota(parseFloat((num * 12).toFixed(1)));
    }
  };

  const handleSickQuotaChange = (val) => {
    setSickLeaveQuota(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPerMonthSick(parseFloat((num / 12).toFixed(2)));
    }
  };

  const handlePerMonthSickChange = (val) => {
    setPerMonthSick(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setSickLeaveQuota(parseFloat((num * 12).toFixed(1)));
    }
  };

  const handleEarnedQuotaChange = (val) => {
    setEarnedLeaveQuota(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPerMonthEarned(parseFloat((num / 12).toFixed(2)));
    }
  };

  const handlePerMonthEarnedChange = (val) => {
    setPerMonthEarned(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setEarnedLeaveQuota(parseFloat((num * 12).toFixed(1)));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Firm Leave Policy & Quotas ⚙️">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
          <p className="font-bold text-indigo-400">Firm-Wide Custom Leave Quotas</p>
          <p className="text-slate-400">
            Set annual and monthly leave allowances for your firm. Changing monthly rates automatically updates yearly totals (12x).
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5">Calculation & Tracking Mode</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAccrualMode('YEARLY')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                accrualMode === 'YEARLY'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="font-bold text-slate-100">Per Year (Annual)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Full yearly quota allocated upfront</p>
              </div>
              <FiCalendar className="w-5 h-5 text-indigo-400" />
            </button>

            <button
              type="button"
              onClick={() => setAccrualMode('MONTHLY')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                accrualMode === 'MONTHLY'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="font-bold text-slate-100">Per Month (Accrual)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Accrued monthly limit breakdown</p>
              </div>
              <FiClock className="w-5 h-5 text-purple-400" />
            </button>
          </div>
        </div>

        {/* Quota Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Casual Leave */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-indigo-400">Casual Leave (CL)</label>
            <div>
              <span className="text-[10px] text-slate-400">Annual Limit (Days/Year)</span>
              <input
                type="number"
                step="0.5"
                min="0"
                value={casualLeaveQuota}
                onChange={(e) => handleCasualQuotaChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 mt-1"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Monthly Accrual (Days/Month)</span>
              <input
                type="number"
                step="0.1"
                min="0"
                value={perMonthCasual}
                onChange={(e) => handlePerMonthCasualChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 mt-1"
              />
            </div>
          </div>

          {/* Sick Leave */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-purple-400">Sick Leave (SL)</label>
            <div>
              <span className="text-[10px] text-slate-400">Annual Limit (Days/Year)</span>
              <input
                type="number"
                step="0.5"
                min="0"
                value={sickLeaveQuota}
                onChange={(e) => handleSickQuotaChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-purple-500 mt-1"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Monthly Accrual (Days/Month)</span>
              <input
                type="number"
                step="0.1"
                min="0"
                value={perMonthSick}
                onChange={(e) => handlePerMonthSickChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-purple-500 mt-1"
              />
            </div>
          </div>

          {/* Earned Leave */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-emerald-400">Earned Leave (EL)</label>
            <div>
              <span className="text-[10px] text-slate-400">Annual Limit (Days/Year)</span>
              <input
                type="number"
                step="0.5"
                min="0"
                value={earnedLeaveQuota}
                onChange={(e) => handleEarnedQuotaChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Monthly Accrual (Days/Month)</span>
              <input
                type="number"
                step="0.1"
                min="0"
                value={perMonthEarned}
                onChange={(e) => handlePerMonthEarnedChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
              />
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={updateAllBalances}
            onChange={(e) => setUpdateAllBalances(e.target.checked)}
            className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
          />
          <span>Update existing employee balances to match these new quota limits</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
        >
          <FiSettings className="w-4 h-4" />
          <span>{isSubmitting ? 'Updating Policy...' : 'Save Firm Leave Policy'}</span>
        </button>
      </form>
    </Modal>
  );
};
