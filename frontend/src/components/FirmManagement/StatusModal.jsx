import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const StatusModal = ({ isOpen, onClose, onConfirm, currentStatus, firmName }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || 'ACTIVE');

  if (!isOpen) return null;

  const statuses = [
    {
      value: 'ACTIVE',
      label: 'Active',
      desc: 'Firm is active. All users can login and perform standard operations.',
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      warning: null,
    },
    {
      value: 'INACTIVE',
      label: 'Inactive',
      desc: 'Firm is deactivated. All users of this firm will be logged out instantly and blocked from logging in.',
      colorClass: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
      warning: 'Deactivating will terminate all active user sessions for this firm immediately.',
    },
    {
      value: 'SUSPENDED',
      label: 'Suspended',
      desc: 'Firm is suspended due to violations or billing issues. Access is blocked immediately.',
      colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      warning: 'Suspension is a critical action. All user sessions will be revoked, and access will be completely locked.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(selectedStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Change Firm Status</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Firm Name</span>
            <p className="text-sm font-semibold text-white mt-0.5">{firmName}</p>
          </div>

          <div className="space-y-3 mb-6">
            {statuses.map((status) => (
              <label
                key={status.value}
                className={`flex gap-3 items-start p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedStatus === status.value
                    ? 'border-brand-500 bg-brand-500/5 shadow-glow-indigo/5'
                    : 'border-slate-800 bg-slate-950/20 hover:bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="firmStatus"
                  value={status.value}
                  checked={selectedStatus === status.value}
                  onChange={() => setSelectedStatus(status.value)}
                  className="mt-1 accent-brand-500"
                />
                <div>
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    {status.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${status.colorClass}`}>
                      {status.value}
                    </span>
                  </span>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">
                    {status.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Alert / Warning */}
          {statuses.find((s) => s.value === selectedStatus)?.warning && (
            <div className="flex gap-2.5 items-start p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs mb-6 leading-normal">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Warning:</span>{' '}
                {statuses.find((s) => s.value === selectedStatus).warning}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-500 transition-all shadow-glow-indigo/20"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusModal;
