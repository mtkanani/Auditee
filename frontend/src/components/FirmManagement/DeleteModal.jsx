import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, firmName }) => {
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmText === 'DELETE') {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Delete Firm</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning Alert */}
        <div className="flex gap-3 items-start p-4 mx-6 mt-6 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs leading-normal">
          <AlertTriangle size={18} className="shrink-0" />
          <div>
            <span className="font-bold">CRITICAL WARNING:</span> Deleting{' '}
            <strong className="text-white font-bold">{firmName}</strong> is permanent and cannot be undone. This will soft-delete the firm record, mark it as inactive, and terminate all active user sessions for this firm immediately.
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Type <strong className="text-white">DELETE</strong> to confirm deactivation
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors text-sm"
              autoComplete="off"
            />
          </div>

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
              disabled={confirmText !== 'DELETE'}
              className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-500 transition-all disabled:opacity-40 disabled:pointer-events-none shadow-glow-indigo/10"
            >
              Delete Firm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteModal;
