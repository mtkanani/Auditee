import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { announcementService } from '../../services/announcementService';
import { motion } from 'framer-motion';
import { FiRadio, FiCheckCircle, FiClock, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const UserAnnouncements = () => {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await announcementService.getUserNotices();
      setNotices(res.data || []);
    } catch (err) {
      toast.error('Failed to load firm notices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await announcementService.acknowledgeNotice(id);
      toast.success('Notice acknowledged successfully!');
      fetchNotices();
    } catch (err) {
      toast.error(err.message || 'Failed to acknowledge notice');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Firm Notice Board"
        subtitle="Review mandatory firm broadcasts, compliance notices, and policy guidelines from firm administration"
      />

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-500 space-y-2">
            <FiRadio className="w-10 h-10 mx-auto text-slate-600" />
            <p className="font-semibold text-slate-300">No firm notices published yet.</p>
            <p className="text-xs text-slate-500">
              When firm admins broadcast announcements, they will appear here.
            </p>
          </div>
        ) : (
          notices.map((notice) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border shadow-xl space-y-4 ${
                !notice.isAcknowledged
                  ? 'bg-slate-900 border-indigo-500/40 shadow-indigo-500/5'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      notice.priority === 'URGENT'
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        : notice.priority === 'WARNING'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                    }`}
                  >
                    {notice.priority === 'URGENT' ? (
                      <FiAlertTriangle className="w-5 h-5" />
                    ) : (
                      <FiRadio className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-800 text-indigo-400 border border-slate-700">
                        {notice.category || 'GENERAL'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          notice.priority === 'URGENT'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : notice.priority === 'WARNING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {notice.priority}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100 mt-1">{notice.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 self-end sm:self-center">
                  <FiClock className="w-3.5 h-3.5" />
                  <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Content */}
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {notice.content}
              </p>

              {/* Footer / Action */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  Published by Firm Admin
                </span>

                {notice.isAcknowledged ? (
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>
                      Acknowledged {notice.acknowledgedAt ? `on ${new Date(notice.acknowledgedAt).toLocaleDateString()}` : ''}
                    </span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleAcknowledge(notice.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Acknowledge & Mark Read</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
