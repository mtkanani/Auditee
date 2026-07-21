import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { CreateNoticeModal } from '../../components/announcements/CreateNoticeModal';
import { announcementService } from '../../services/announcementService';
import { motion } from 'framer-motion';
import {
  FiRadio,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiAlertTriangle,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export const FirmAnnouncements = () => {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedNoticeId, setExpandedNoticeId] = useState(null);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await announcementService.getAdminNotices();
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

  const handleCreateNotice = async (noticeData) => {
    try {
      await announcementService.createNotice(noticeData);
      toast.success('Notice broadcast created successfully!');
      fetchNotices();
    } catch (err) {
      toast.error(err.message || 'Failed to create notice');
      throw err;
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice broadcast?')) return;
    try {
      await announcementService.deleteNotice(id);
      toast.success('Notice deleted!');
      fetchNotices();
    } catch (err) {
      toast.error(err.message || 'Failed to delete notice');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Firm Notice Board & Broadcasts"
          subtitle="Broadcast firm-wide compliance notices, policies, and instructions with live acknowledgment receipts"
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 shrink-0"
        >
          <FiPlus className="w-4 h-4" />
          <span>New Broadcast Notice</span>
        </button>
      </div>

      {/* Notice Feed List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading firm notices...</div>
        ) : notices.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-500 space-y-2">
            <FiRadio className="w-10 h-10 mx-auto text-slate-600" />
            <p className="font-semibold text-slate-300">No active notice broadcasts yet.</p>
            <p className="text-xs text-slate-500">
              Click "New Broadcast Notice" above to publish a firm-wide notice to all staff members.
            </p>
          </div>
        ) : (
          notices.map((notice) => {
            const isExpanded = expandedNoticeId === notice.id;
            const metrics = notice.metrics || {};
            const percent = metrics.acknowledgedPercentage || 0;

            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
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

                  <div className="flex items-center gap-3 self-end sm:self-center text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <FiClock className="w-3.5 h-3.5" />
                      <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="p-2 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-colors"
                      title="Delete Notice"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {notice.content}
                </p>

                {/* Live Read & Acknowledgment Analytics Bar */}
                <div className="pt-2 border-t border-slate-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <FiUsers className="text-indigo-400" />
                      <span>Staff Acknowledgment Status</span>
                    </span>
                    <span className="text-indigo-300">
                      {metrics.acknowledgedCount} / {metrics.totalUsers} Staff ({percent}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Accordion Toggle for Detailed Receipts */}
                  <button
                    onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                    className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Staff Receipts' : 'View Staff Receipts List'}</span>
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {/* Staff List Breakdown */}
                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <h4 className="font-bold text-slate-300 border-b border-slate-800 pb-2">
                        Staff Acknowledgment Receipts ({notice.reads.length})
                      </h4>
                      {notice.reads.length === 0 ? (
                        <p className="text-slate-500">No staff members have acknowledged this notice yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {notice.reads.map((r) => (
                            <div
                              key={r.id}
                              className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                            >
                              <div>
                                <span className="font-semibold text-slate-200">
                                  {r.user ? `${r.user.firstName} ${r.user.lastName}` : `User #${r.userId}`}
                                </span>
                                <p className="text-[10px] text-slate-400">{r.user?.email}</p>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <FiCheckCircle /> Acknowledged
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <CreateNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateNotice}
      />
    </div>
  );
};
