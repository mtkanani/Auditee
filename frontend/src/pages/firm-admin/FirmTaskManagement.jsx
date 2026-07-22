import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Pagination } from '../../components/common/Pagination';
import { StatsCard } from '../../components/common/StatsCard';
import { Modal } from '../../components/common/Modal';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { CreateTaskModal } from '../../components/tasks/CreateTaskModal';
import { TaskTemplatesModal } from '../../components/tasks/TaskTemplatesModal';
import {
  FiPlus,
  FiZap,
  FiInbox,
  FiCheckCircle,
  FiClock,
  FiUserCheck,
  FiBriefcase,
  FiEye,
  FiEdit2,
  FiCalendar,
  FiUser,
  FiGlobe,
  FiCheck,
  FiLayers,
} from 'react-icons/fi';
import { taskService } from '../../services/taskService';
import { firmAdminService } from '../../services/firmAdminService';
import toast from 'react-hot-toast';

export const FirmTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [clientRequests, setClientRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'table' | 'requests'

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Client Request Approval Form Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [requestAssignmentScope, setRequestAssignmentScope] = useState('SINGLE');
  const [requestSelectedUserIds, setRequestSelectedUserIds] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const [taskRes, reqRes, usersRes] = await Promise.all([
        taskService.getAllTasks({ page, limit: 20, search, status: statusFilter || undefined, priority: priorityFilter || undefined }),
        taskService.getClientRequests(),
        firmAdminService.getUsers({ limit: 100 }),
      ]);

      setTasks(taskRes.data || []);
      setTotalPages(taskRes.pagination?.totalPages || 1);
      setTotalRecords(taskRes.pagination?.totalRecords || 0);
      setClientRequests(reqRes.data || []);
      setUsers(usersRes.data || usersRes.users || []);
    } catch (err) {
      toast.error('Failed to load firm tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, search, statusFilter, priorityFilter]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      toast.success(`Task status updated to ${newStatus}`);
      fetchTasks();
    } catch (err) {
      toast.error(err.message || 'Failed to update task status');
    }
  };

  const handleApproveRequestSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    if (requestAssignmentScope === 'SINGLE' && requestSelectedUserIds.length === 0) {
      toast.error('Please select an employee to assign this client request');
      return;
    }

    try {
      await taskService.approveClientRequest(selectedRequest.id, {
        assignmentScope: requestAssignmentScope,
        assignedUserIds: requestSelectedUserIds,
      });

      toast.success('Client Work Request approved and assigned!');
      setIsApproveModalOpen(false);
      setSelectedRequest(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.message || 'Failed to approve request');
    }
  };

  // Metrics
  const pendingCount = tasks.filter((t) => t.status === 'PENDING').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  const columns = [
    {
      header: 'Task Title & Client',
      key: 'title',
      render: (r) => (
        <div
          onClick={() => {
            setSelectedTaskId(r.id);
            setIsDetailModalOpen(true);
          }}
          className="cursor-pointer group"
        >
          <p className="font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors">
            {r.title}
          </p>
          <p className="text-xs text-slate-400">
            {r.client?.companyName || r.client?.clientName || 'Firm Internal Task'}
          </p>
        </div>
      ),
    },
    {
      header: 'Assigned Auditor(s)',
      key: 'assignees',
      render: (r) => (
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {r.assignees && r.assignees.length > 0 ? (
            r.assignees.map((a) => (
              <span key={a.id} className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                {a.user?.firstName} {a.user?.lastName}
              </span>
            ))
          ) : r.user ? (
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
              {r.user.firstName} {r.user.lastName}
            </span>
          ) : (
            <span className="text-slate-500 font-semibold">Unassigned</span>
          )}
        </div>
      ),
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (r) => (
        <span
          className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
            r.priority === 'URGENT'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : r.priority === 'HIGH'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}
        >
          {r.priority}
        </span>
      ),
    },
    {
      header: 'Subtasks',
      key: 'subtasks',
      render: (r) => {
        const total = r.subtasks?.length || r._count?.subtasks || 0;
        const done = r.subtasks?.filter((s) => s.isCompleted)?.length || 0;
        return (
          <span className="text-xs font-bold text-slate-300">
            {done}/{total} Items
          </span>
        );
      },
    },
    {
      header: 'Status',
      key: 'status',
      render: (r) => (
        <select
          value={r.status || 'PENDING'}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
        >
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="UNDER_REVIEW">UNDER REVIEW</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (r) => (
        <button
          onClick={() => {
            setSelectedTaskId(r.id);
            setIsDetailModalOpen(true);
          }}
          className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
          title="Open Task Hub"
        >
          <FiEye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task & Audit Workstation"
        subtitle="Assign tasks to Single, Multiple, or ALL Employees, approve Client Work Requests, track Subtasks & History"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTemplatesModalOpen(true)}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <FiZap />
              <span>Use Template</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create & Assign Task</span>
            </button>
          </div>
        }
      />

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Total Tasks" value={totalRecords} icon={FiLayers} color="indigo" />
        <StatsCard title="In Progress Tasks" value={inProgressCount} icon={FiClock} color="purple" />
        <StatsCard title="Completed Tasks" value={completedCount} icon={FiCheckCircle} color="emerald" />
        <StatsCard
          title="Client Work Requests"
          value={clientRequests.length}
          icon={FiInbox}
          color="rose"
        />
      </div>

      {/* Navigation View Tabs */}
      <div className="flex items-center justify-between gap-4 p-2 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'kanban'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kanban Board View
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'table'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Detailed List View
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiInbox />
            <span>Client Work Requests ({clientRequests.length})</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search tasks..."
            className="w-48 sm:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['PENDING', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'].map((colStatus) => {
            const colTasks = tasks.filter((t) => t.status === colStatus);
            return (
              <div key={colStatus} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 min-h-[60vh]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">{colStatus.replace('_', ' ')}</h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTaskId(t.id);
                        setIsDetailModalOpen(true);
                      }}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2 shadow-lg group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                          #{t.id}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                            t.priority === 'URGENT'
                              ? 'bg-rose-500/10 text-rose-400'
                              : t.priority === 'HIGH'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {t.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 truncate">
                        {t.client?.companyName || t.client?.clientName || 'Firm Task'}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Checklist: {t.subtasks?.filter((s) => s.isCompleted)?.length || 0}/{t.subtasks?.length || 0}</span>
                        {t.dueDate && <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <p className="text-xs text-slate-500 py-8 text-center">No tasks in this column</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: TABLE VIEW */}
      {activeTab === 'table' && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <DataTable columns={columns} data={tasks} isLoading={isLoading} />
          <Pagination currentPage={page} totalPages={totalPages} totalRecords={totalRecords} onPageChange={setPage} />
        </div>
      )}

      {/* VIEW 3: CLIENT WORK REQUESTS INBOX */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            <strong>Client Work Requests Inbox:</strong> These are audit and filing requests submitted directly by Clients. Accept requests and assign them to single/multiple/all employees below.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientRequests.map((req) => (
              <div key={req.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    REQUESTED BY CLIENT
                  </span>
                  <span className="text-xs text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-100">{req.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Client: <strong>{req.client?.companyName || req.client?.clientName}</strong> ({req.client?.email})
                  </p>
                  {req.description && <p className="text-xs text-slate-300 mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">{req.description}</p>}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setRequestAssignmentScope('SINGLE');
                      setRequestSelectedUserIds([]);
                      setIsApproveModalOpen(true);
                    }}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
                  >
                    <FiCheck />
                    <span>Accept & Assign Auditor</span>
                  </button>
                </div>
              </div>
            ))}

            {clientRequests.length === 0 && (
              <div className="col-span-2 p-12 text-center text-sm text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
                No pending client work requests. When clients submit work items from their portal, they will appear here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Detail Hub Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onRefresh={fetchTasks}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={fetchTasks}
      />

      {/* Templates Modal */}
      <TaskTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={(tmpl) => {
          setIsTemplatesModalOpen(false);
          setIsCreateModalOpen(true);
        }}
      />

      {/* Approve Client Work Request Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title={`Accept & Assign: ${selectedRequest?.title}`}
      >
        <form onSubmit={handleApproveRequestSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            Client: <strong>{selectedRequest?.client?.companyName || selectedRequest?.client?.clientName}</strong>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-indigo-400">Select Assignment Mode</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRequestAssignmentScope('SINGLE')}
                className={`p-2 rounded-xl border text-xs font-bold ${
                  requestAssignmentScope === 'SINGLE' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Single Auditor
              </button>
              <button
                type="button"
                onClick={() => setRequestAssignmentScope('MULTIPLE')}
                className={`p-2 rounded-xl border text-xs font-bold ${
                  requestAssignmentScope === 'MULTIPLE' ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Team Group
              </button>
              <button
                type="button"
                onClick={() => setRequestAssignmentScope('ALL')}
                className={`p-2 rounded-xl border text-xs font-bold ${
                  requestAssignmentScope === 'ALL' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                ALL Employees
              </button>
            </div>

            {requestAssignmentScope === 'SINGLE' && (
              <select
                value={requestSelectedUserIds[0] || ''}
                onChange={(e) => setRequestSelectedUserIds(e.target.value ? [parseInt(e.target.value, 10)] : [])}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              >
                <option value="">Select Auditor Employee...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.designation || 'Staff'})
                  </option>
                ))}
              </select>
            )}

            {requestAssignmentScope === 'MULTIPLE' && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {users.map((u) => (
                  <label key={u.id} className="flex items-center gap-2 p-1.5 rounded bg-slate-950 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requestSelectedUserIds.includes(u.id)}
                      onChange={() => {
                        if (requestSelectedUserIds.includes(u.id)) {
                          setRequestSelectedUserIds(requestSelectedUserIds.filter((id) => id !== u.id));
                        } else {
                          setRequestSelectedUserIds([...requestSelectedUserIds, u.id]);
                        }
                      }}
                    />
                    <span>{u.firstName} {u.lastName}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg mt-2"
          >
            Confirm & Assign Task
          </button>
        </form>
      </Modal>
    </div>
  );
};
