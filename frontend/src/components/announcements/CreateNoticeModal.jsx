import React, { useState } from 'react';
import { Radio, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';

export const CreateNoticeModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'COMPLIANCE',
    priority: 'INFO',
    expiresAt: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuccess({
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category,
        priority: form.priority,
        expiresAt: form.expiresAt || null,
      });
      onClose();
      setForm({
        title: '',
        content: '',
        category: 'COMPLIANCE',
        priority: 'INFO',
        expiresAt: '',
      });
    } catch {
      // Handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <Radio size="1em" className="text-indigo-400" />
          <span>Broadcast Firm Announcement</span>
        </span>
      }
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Notice Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mandatory GSTR-3B Reconciliation Checklist / Office Holiday"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category & Priority Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="COMPLIANCE">COMPLIANCE</option>
                  <option value="POLICY">POLICY</option>
                  <option value="DEADLINE">DEADLINE</option>
                  <option value="GENERAL">GENERAL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Priority Badge
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="INFO">INFO (Standard)</option>
                  <option value="WARNING">WARNING (High)</option>
                  <option value="URGENT">URGENT (Banner Alert)</option>
                </select>
              </div>
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Notice Expiration Date (Optional)
              </label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Notice Description & Instructions <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Detailed instructions or policy notes for all firm members..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5"  />
                <span>{isSubmitting ? 'Broadcasting...' : 'Broadcast Notice'}</span>
              </button>
            </div>
          </form>
    </Modal>
  );
};
