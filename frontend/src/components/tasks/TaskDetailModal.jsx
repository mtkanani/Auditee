import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiCheckSquare,
  FiSquare,
  FiMessageSquare,
  FiPaperclip,
  FiClock,
  FiUser,
  FiAlertCircle,
  FiPlus,
  FiSend,
  FiBriefcase,
  FiTag,
  FiCalendar,
  FiCheckCircle,
} from 'react-icons/fi';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';

export const TaskDetailModal = ({ taskId, isOpen, onClose, onRefresh }) => {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subtasks'); // 'subtasks' | 'comments' | 'documents' | 'history'

  // Subtask Input
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Comment Input
  const [commentText, setCommentText] = useState('');
  const [commentFileUrl, setCommentFileUrl] = useState('');

  // Document Attachment Input
  const [docName, setDocName] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const fetchTaskDetails = async () => {
    if (!taskId) return;
    setIsLoading(true);
    try {
      const res = await taskService.getTaskById(taskId);
      setTask(res.data || res);
    } catch (err) {
      toast.error('Failed to load task details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
    }
  }, [isOpen, taskId]);

  if (!isOpen) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      toast.success(`Task status updated to ${newStatus}`);
      fetchTaskDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to update task status');
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    try {
      await taskService.addSubtask(taskId, newSubtaskTitle);
      toast.success('Subtask added to checklist');
      setNewSubtaskTitle('');
      fetchTaskDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to add subtask');
    }
  };

  const handleToggleSubtask = async (subtaskId, currentStatus) => {
    try {
      await taskService.toggleSubtask(taskId, subtaskId, !currentStatus);
      fetchTaskDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to update subtask');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await taskService.addComment(taskId, { comment: commentText, fileUrl: commentFileUrl });
      toast.success('Comment posted');
      setCommentText('');
      setCommentFileUrl('');
      fetchTaskDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to post comment');
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!docName.trim() || !docUrl.trim()) {
      toast.error('File name and URL are required');
      return;
    }
    try {
      await taskService.addDocument(taskId, { fileName: docName, fileUrl: docUrl });
      toast.success('Attachment added');
      setDocName('');
      setDocUrl('');
      fetchTaskDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to attach document');
    }
  };

  // Subtask Progress Calculation
  const totalSubtasks = task?.subtasks?.length || 0;
  const completedSubtasks = task?.subtasks?.filter((s) => s.isCompleted)?.length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-4xl h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                  Task #{task?.id}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded ${
                    task?.priority === 'URGENT'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : task?.priority === 'HIGH'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {task?.priority || 'MEDIUM'} PRIORITY
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">{task?.title}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-3">
                <span>Client: {task?.client?.companyName || task?.client?.clientName || 'Firm Internal'}</span>
                {task?.dueDate && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <FiCalendar /> Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Selector */}
              <select
                value={task?.status || 'PENDING'}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Assignees & Description Header */}
          <div className="p-4 bg-slate-950/40 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Auditor(s)</span>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {task?.assignees?.map((a) => (
                  <span key={a.id} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700/60 flex items-center gap-1.5">
                    <FiUser className="text-indigo-400" />
                    <span>{a.user?.firstName} {a.user?.lastName}</span>
                  </span>
                ))}

                {(!task?.assignees || task.assignees.length === 0) && (
                  <span className="text-xs font-semibold text-slate-300">
                    {task?.user ? `${task.user.firstName} ${task.user.lastName}` : 'Unassigned'}
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description / Scope</span>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">{task?.description || 'No detailed scope provided.'}</p>
            </div>
          </div>

          {/* Subtask Progress Bar */}
          {totalSubtasks > 0 && (
            <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-4">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FiCheckCircle className="text-indigo-400" />
                <span>Checklist Progress ({completedSubtasks}/{totalSubtasks})</span>
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-indigo-400">{progressPercent}%</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/60 overflow-x-auto">
            <button
              onClick={() => setActiveTab('subtasks')}
              className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'subtasks' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiCheckSquare className="w-4 h-4" />
              <span>Subtasks Checklist ({totalSubtasks})</span>
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'comments' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiMessageSquare className="w-4 h-4" />
              <span>Discussion Thread ({task?.comments?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'documents' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiPaperclip className="w-4 h-4" />
              <span>Attachments ({task?.documents?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'history' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiClock className="w-4 h-4" />
              <span>Audit History ({task?.history?.length || 0})</span>
            </button>
          </div>

          {/* Modal Tab Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-500">Loading task hub details...</div>
            ) : (
              <>
                {/* TAB 1: Subtasks Checklist */}
                {activeTab === 'subtasks' && (
                  <div className="space-y-6">
                    <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add new subtask item (e.g. Reconcile GSTR-2B purchase tax credit)..."
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        <FiPlus />
                        <span>Add Item</span>
                      </button>
                    </form>

                    <div className="space-y-2">
                      {task?.subtasks?.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => handleToggleSubtask(s.id, s.isCompleted)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            s.isCompleted
                              ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                              : 'bg-slate-950 border-slate-800 hover:border-indigo-500/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {s.isCompleted ? (
                              <FiCheckSquare className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <FiSquare className="w-5 h-5 text-slate-500" />
                            )}
                            <span className={`text-xs font-semibold ${s.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                              {s.title}
                            </span>
                          </div>

                          {s.completedAt && (
                            <span className="text-[10px] text-emerald-400 font-bold">
                              Completed {new Date(s.completedAt).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      ))}

                      {(!task?.subtasks || task.subtasks.length === 0) && (
                        <p className="text-xs text-slate-500 py-6 text-center">No subtasks added yet. Type a checklist item above to begin.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: Discussion Thread */}
                {activeTab === 'comments' && (
                  <div className="space-y-6">
                    <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                      {task?.comments?.map((c) => (
                        <div key={c.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-indigo-400">{c.commenterName} ({c.commenterRole})</span>
                            <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-slate-200">{c.comment}</p>
                          {c.fileUrl && (
                            <a href={c.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] text-purple-400 hover:underline flex items-center gap-1 mt-1">
                              <FiPaperclip /> View Attached File
                            </a>
                          )}
                        </div>
                      ))}

                      {(!task?.comments || task.comments.length === 0) && (
                        <p className="text-xs text-slate-500 py-6 text-center">No comments yet. Post a question or note below.</p>
                      )}
                    </div>

                    <form onSubmit={handleAddComment} className="space-y-3 pt-3 border-t border-slate-800">
                      <textarea
                        required
                        rows={2}
                        placeholder="Write a comment or discussion note..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                      />
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          placeholder="Optional File URL attachment..."
                          value={commentFileUrl}
                          onChange={(e) => setCommentFileUrl(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                        />
                        <button
                          type="submit"
                          className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
                        >
                          <FiSend />
                          <span>Post Comment</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB 3: Attachments */}
                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    <form onSubmit={handleAddDocument} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Attach Task File / Working Sheet</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="File Name (e.g. GSTR-3B Computation Sheet.pdf)"
                          value={docName}
                          onChange={(e) => setDocName(e.target.value)}
                          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Document File Link / URL"
                          value={docUrl}
                          onChange={(e) => setDocUrl(e.target.value)}
                          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button type="submit" className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs">
                          Upload File Record
                        </button>
                      </div>
                    </form>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {task?.documents?.map((doc) => (
                        <div key={doc.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-100">{doc.fileName}</p>
                            <p className="text-[10px] text-slate-500">Uploaded by {doc.uploadedRole || 'User'}</p>
                          </div>
                          <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 text-amber-400">
                            <FiPaperclip />
                          </a>
                        </div>
                      ))}

                      {(!task?.documents || task.documents.length === 0) && (
                        <p className="text-xs text-slate-500 col-span-2 text-center py-4">No attachments uploaded for this task yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: Audit History */}
                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-200">Chronological Task Audit Timeline</h4>
                    <div className="space-y-3 relative border-l border-slate-800 ml-4 pl-6">
                      {task?.history?.map((h) => (
                        <div key={h.id} className="relative">
                          <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900" />
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-blue-400">{h.action}</span>
                              <span className="text-[10px] text-slate-500">{new Date(h.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-300">{h.details}</p>
                            <p className="text-[10px] text-slate-500">By {h.performedName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
