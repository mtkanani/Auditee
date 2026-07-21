import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheckCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';
import { announcementService } from '../../services/announcementService';
import toast from 'react-hot-toast';

export const NoticeBanner = () => {
  const [notices, setNotices] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);

  const fetchNotices = async () => {
    try {
      const res = await announcementService.getUserNotices();
      const list = res.data || [];
      // Filter unacknowledged urgent or warning notices
      const unack = list.filter((n) => !n.isAcknowledged);
      setNotices(unack);
    } catch (err) {
      // Quiet fail for banner
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await announcementService.acknowledgeNotice(id);
      toast.success('Notice acknowledged successfully!');
      setDismissedIds((prev) => [...prev, id]);
    } catch (err) {
      toast.error('Failed to acknowledge notice');
    }
  };

  const activeNotices = notices.filter((n) => !dismissedIds.includes(n.id));

  if (activeNotices.length === 0) return null;

  const currentNotice = activeNotices[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-4 rounded-2xl border shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          currentNotice.priority === 'URGENT'
            ? 'bg-rose-950/40 border-rose-500/30 text-rose-200 shadow-rose-950/20'
            : currentNotice.priority === 'WARNING'
            ? 'bg-amber-950/40 border-amber-500/30 text-amber-200 shadow-amber-950/20'
            : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200 shadow-indigo-950/20'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 shrink-0">
            {currentNotice.priority === 'URGENT' ? (
              <FiAlertTriangle className="w-5 h-5 text-rose-400" />
            ) : currentNotice.priority === 'WARNING' ? (
              <FiBell className="w-5 h-5 text-amber-400" />
            ) : (
              <FiInfo className="w-5 h-5 text-indigo-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800">
                {currentNotice.category || 'FIRM NOTICE'}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(currentNotice.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 mt-1">{currentNotice.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{currentNotice.content}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={() => handleAcknowledge(currentNotice.id)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            <FiCheckCircle className="w-4 h-4" />
            <span>Acknowledge & Mark Read</span>
          </button>

          {activeNotices.length > 1 && (
            <span className="text-xs font-semibold px-2 py-1 bg-slate-900/80 rounded-lg text-slate-400">
              +{activeNotices.length - 1} more
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
