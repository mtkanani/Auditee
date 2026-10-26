import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CircleCheckBig, Info, TriangleAlert } from 'lucide-react';
import { useUserAnnouncements, useAcknowledgeNotice } from '../../queries/useAnnouncements';

export const NoticeBanner = () => {
  const { notices: allNotices = [] } = useUserAnnouncements();
  const acknowledgeNoticeMutation = useAcknowledgeNotice();
  const [dismissedIds, setDismissedIds] = useState([]);

  const unackNotices = useMemo(
    () => allNotices.filter((n) => !n.isAcknowledged),
    [allNotices]
  );
  const activeNotices = useMemo(
    () => unackNotices.filter((n) => !dismissedIds.includes(n.id)),
    [unackNotices, dismissedIds]
  );

  const handleAcknowledge = (id) => {
    acknowledgeNoticeMutation.mutate(id, {
      onSuccess: () => {
        setDismissedIds((prev) => [...prev, id]);
      },
    });
  };

  if (activeNotices.length === 0) return null;

  const currentNotice = activeNotices[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-4 rounded-2xl border shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${currentNotice.priority === 'URGENT'
            ? 'bg-rose-950/40 border-rose-500/30 text-rose-200 shadow-rose-950/20'
            : currentNotice.priority === 'WARNING'
              ? 'bg-amber-950/40 border-amber-500/30 text-amber-200 shadow-amber-950/20'
              : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200 shadow-indigo-950/20'
          }`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 shrink-0">
            {currentNotice.priority === 'URGENT' ? (
              <TriangleAlert className="w-5 h-5 text-rose-400"  />
            ) : currentNotice.priority === 'WARNING' ? (
              <Bell className="w-5 h-5 text-amber-400"  />
            ) : (
              <Info className="w-5 h-5 text-indigo-400"  />
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
            disabled={acknowledgeNoticeMutation.isPending}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <CircleCheckBig className="w-4 h-4"  />
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
