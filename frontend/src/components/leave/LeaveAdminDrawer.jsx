import React, { useState, useEffect } from 'react';
import { Drawer } from '../common/Drawer';
import { FiCheckCircle, FiXCircle, FiCalendar, FiClock, FiUser, FiZap } from 'react-icons/fi';
import { leaveService } from '../../services/leaveService';
import toast from 'react-hot-toast';

export const LeaveAdminDrawer = ({ isOpen, onClose, onRefresh }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remarksInput, setRemarksInput] = useState({});

  const fetchPending = async () => {
    setIsLoading(true);
    try {
      const res = await leaveService.getPendingRequests();
      setPendingRequests(res.data?.pendingRequests || []);
    } catch (err) {
      console.log('Error fetching pending leave requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPending();
    }
  }, [isOpen]);

  const handleReview = async (id, status) => {
    const remarks = remarksInput[id] || '';
    try {
      await leaveService.reviewLeave(id, status, remarks);
      toast.success(`Leave request ${status.toLowerCase()}!`);
      fetchPending();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || `Failed to ${status.toLowerCase()} leave`);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`🌴 Top Bar Leave Approval Inbox (${pendingRequests.length} Pending)`}
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading pending leave applications...</div>
        ) : pendingRequests.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500 space-y-2">
            <FiCheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-bold text-slate-300">All caught up!</p>
            <p>There are no pending leave applications to review right now.</p>
          </div>
        ) : (
          pendingRequests.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                    {item.user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-100">
                      {item.user?.firstName} {item.user?.lastName}
                    </h4>
                    <p className="text-[10px] text-slate-400">{item.user?.designation || 'Staff Auditor'}</p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {item.leaveType.replace('_', ' ')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-amber-400 flex items-center gap-1">
                    <FiCalendar /> {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
                  </span>
                  <span className="text-indigo-400 font-bold">{item.totalDays} Day(s)</span>
                </div>
                <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                  <strong>Reason:</strong> {item.reason}
                </p>
              </div>

              {/* Admin Remarks Input */}
              <input
                type="text"
                placeholder="Optional admin remarks..."
                value={remarksInput[item.id] || ''}
                onChange={(e) => setRemarksInput({ ...remarksInput, [item.id]: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              />

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleReview(item.id, 'APPROVED')}
                  className="py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md"
                >
                  <FiCheckCircle /> Approve Leave
                </button>

                <button
                  onClick={() => handleReview(item.id, 'REJECTED')}
                  className="py-1.5 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/20 font-bold text-xs flex items-center justify-center gap-1"
                >
                  <FiXCircle /> Reject Leave
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
};
