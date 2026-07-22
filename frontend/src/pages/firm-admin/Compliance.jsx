import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import {
  FiShield,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiZap,
  FiBell,
  FiPlus,
  FiCalendar,
  FiList,
  FiFileText,
  FiUserCheck,
  FiAlertCircle,
} from 'react-icons/fi';
import { complianceService } from '../../services/complianceService';
import { firmAdminService } from '../../services/firmAdminService';
import toast from 'react-hot-toast';

export const Compliance = () => {
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'table'

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Month/Year for Statutory Presets Generator
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [assignedUserIds, setAssignedUserIds] = useState([]);

  // New Custom Item Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('GST');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPeriod, setNewPeriod] = useState('');
  const [newClientId, setNewClientId] = useState('');
  const [newPenalty, setNewPenalty] = useState('');

  const fetchCompliance = async () => {
    setIsLoading(true);
    try {
      const [compRes, clientRes, userRes] = await Promise.all([
        complianceService.getAllComplianceItems({ search, category: categoryFilter || undefined, status: statusFilter || undefined }),
        firmAdminService.getClients({ limit: 100 }),
        firmAdminService.getUsers({ limit: 100 }),
      ]);
      setItems(compRes.data || []);
      setClients(clientRes.data || clientRes.clients || []);
      setUsers(userRes.data || userRes.users || []);
    } catch (err) {
      toast.error('Failed to load compliance tracker data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
  }, [search, categoryFilter, statusFilter]);

  const handleGeneratePresets = async () => {
    try {
      await complianceService.generateIndianPresets(selectedYear, selectedMonth);
      toast.success(`Indian Statutory Calendar generated for Month ${selectedMonth}/${selectedYear}!`);
      fetchCompliance();
    } catch (err) {
      toast.error(err.message || 'Failed to generate statutory presets');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await complianceService.updateComplianceStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchCompliance();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleConvertToTaskSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await complianceService.convertToTask(selectedItem.id, { assignedUserIds });
      toast.success(`Compliance item converted to an active Task!`);
      setIsTaskModalOpen(false);
      setSelectedItem(null);
      setAssignedUserIds([]);
      fetchCompliance();
    } catch (err) {
      toast.error(err.message || 'Failed to convert to task');
    }
  };

  const handleSendReminder = async (item) => {
    try {
      await complianceService.sendReminder(item.id);
      toast.success(`Deadline reminder broadcasted on Notice Board for ${item.title}!`);
    } catch (err) {
      toast.error(err.message || 'Failed to broadcast reminder');
    }
  };

  const handleAddCustomSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) {
      toast.error('Title and Due Date are required');
      return;
    }
    try {
      await complianceService.createComplianceItem({
        title: newTitle.trim(),
        category: newCategory,
        dueDate: newDueDate,
        period: newPeriod.trim(),
        clientId: newClientId ? parseInt(newClientId, 10) : null,
        penaltyDetails: newPenalty.trim(),
      });
      toast.success('Custom compliance item added!');
      setIsAddModalOpen(false);
      setNewTitle('');
      setNewDueDate('');
      setNewPeriod('');
      setNewPenalty('');
      fetchCompliance();
    } catch (err) {
      toast.error(err.message || 'Failed to add item');
    }
  };

  // Metrics
  const totalItems = items.length;
  const pendingCount = items.filter((i) => i.status === 'UPCOMING' || i.status === 'IN_PROGRESS').length;
  const overdueCount = items.filter((i) => i.status === 'OVERDUE').length;
  const filedCount = items.filter((i) => i.status === 'FILED').length;

  const columns = [
    {
      header: 'Compliance Filing Item',
      key: 'title',
      render: (r) => (
        <div>
          <p className="font-extrabold text-slate-100">{r.title}</p>
          <p className="text-xs text-slate-400">
            Period: {r.period || 'N/A'} • Client: {r.client?.companyName || r.client?.clientName || 'All Firm Clients'}
          </p>
          {r.penaltyDetails && <p className="text-[10px] text-amber-400 font-semibold mt-0.5">{r.penaltyDetails}</p>}
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (r) => (
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {r.category}
        </span>
      ),
    },
    {
      header: 'Due Date',
      key: 'dueDate',
      render: (r) => (
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
          <FiCalendar /> {new Date(r.dueDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (r) => (
        <select
          value={r.status || 'UPCOMING'}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
        >
          <option value="UPCOMING">UPCOMING</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="FILED">FILED</option>
          <option value="OVERDUE">OVERDUE</option>
          <option value="EXTENDED">EXTENDED</option>
        </select>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedItem(r);
              setIsTaskModalOpen(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 text-xs font-bold flex items-center gap-1"
            title="Convert to Task"
          >
            <FiZap />
            <span>Task</span>
          </button>

          <button
            onClick={() => handleSendReminder(r)}
            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            title="Broadcast Notice Reminder"
          >
            <FiBell className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Indian CA Compliance Management"
        subtitle="Track GST Returns, Income Tax Audit (Form 3CD), TDS, ROC/MCA, PF/ESI, and Statutory Audit Due Dates"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Custom Filing</span>
            </button>
          </div>
        }
      />

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Total Compliance Items" value={totalItems} icon={FiShield} color="indigo" />
        <StatsCard title="Pending Statutory Filings" value={pendingCount} icon={FiClock} color="amber" />
        <StatsCard title="Overdue Deadlines" value={overdueCount} icon={FiAlertTriangle} color="rose" />
        <StatsCard title="Filed This Period" value={filedCount} icon={FiCheckCircle} color="emerald" />
      </div>

      {/* Statutory Presets Generator Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FiZap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Indian Statutory Deadlines Generator</h4>
            <p className="text-[11px] text-slate-400">
              1-Click auto-populate statutory GST (11th/20th), TDS (7th/31st), PF/ESI (15th), Tax Audit (30th Sept), and ROC due dates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
              <option key={m} value={m}>
                {new Date(2026, m - 1, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
          >
            {[2025, 2026, 2027, 2028].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={handleGeneratePresets}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg whitespace-nowrap"
          >
            Generate Deadlines
          </button>
        </div>
      </div>

      {/* Filter & View Mode Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'calendar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiCalendar />
            <span>Compliance Calendar</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'table' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiList />
            <span>Master List View</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search filing name, period..." className="w-full sm:w-48" />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
          >
            <option value="">All Categories</option>
            <option value="GST">GST Returns</option>
            <option value="INCOME_TAX">Income Tax & Audit</option>
            <option value="TDS">TDS Returns</option>
            <option value="ROC_MCA">ROC / MCA</option>
            <option value="PF_ESI">PF & ESI</option>
            <option value="AUDIT">Audit Schedules</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="UPCOMING">UPCOMING</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="FILED">FILED</option>
            <option value="OVERDUE">OVERDUE</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: COMPLIANCE CALENDAR GRID */}
      {viewMode === 'calendar' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FiCalendar className="text-indigo-400" />
            <span>Statutory Compliance Calendar Grid</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2.5 shadow-lg group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <FiClock /> {new Date(item.dueDate).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {item.period || 'Period N/A'} • {item.client?.companyName || item.client?.clientName || 'All Clients'}
                </p>

                {item.penaltyDetails && (
                  <p className="text-[10px] text-rose-300 font-semibold p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    ⚠️ {item.penaltyDetails}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <select
                    value={item.status || 'UPCOMING'}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="text-[10px] bg-slate-900 border border-slate-800 rounded-md px-2 py-1 text-slate-200 font-bold"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="FILED">FILED</option>
                    <option value="OVERDUE">OVERDUE</option>
                  </select>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsTaskModalOpen(true);
                      }}
                      className="py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1"
                    >
                      <FiZap />
                      <span>Convert Task</span>
                    </button>

                    <button
                      onClick={() => handleSendReminder(item)}
                      className="p-1 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                      title="Send Reminder"
                    >
                      <FiBell className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="col-span-3 text-center py-12 text-xs text-slate-500">
                No statutory compliance items found. Click "Generate Deadlines" above to auto-populate Indian tax due dates.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: MASTER TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <DataTable columns={columns} data={items} isLoading={isLoading} />
        </div>
      )}

      {/* Convert Compliance to Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={`⚡ Convert to Active Task: ${selectedItem?.title}`}
      >
        <form onSubmit={handleConvertToTaskSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <p>Category: <strong>{selectedItem?.category}</strong></p>
            <p>Due Date: <strong>{selectedItem?.dueDate ? new Date(selectedItem.dueDate).toLocaleDateString() : ''}</strong></p>
          </div>

          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            <label className="block text-xs font-bold text-indigo-400">Select Auditor Employee(s)</label>
            {users.map((u) => (
              <label key={u.id} className="flex items-center gap-2 p-1.5 rounded bg-slate-950 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignedUserIds.includes(u.id)}
                  onChange={() => {
                    if (assignedUserIds.includes(u.id)) {
                      setAssignedUserIds(assignedUserIds.filter((id) => id !== u.id));
                    } else {
                      setAssignedUserIds([...assignedUserIds, u.id]);
                    }
                  }}
                />
                <span>{u.firstName} {u.lastName} ({u.designation || 'Staff'})</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg mt-2"
          >
            Create Task & Assign Auditors
          </button>
        </form>
      </Modal>

      {/* Add Custom Compliance Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Custom Compliance Filing">
        <form onSubmit={handleAddCustomSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Filing Item Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Special Internal GST Reconciliation"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              >
                <option value="GST">GST Returns</option>
                <option value="INCOME_TAX">Income Tax & Audit</option>
                <option value="TDS">TDS Returns</option>
                <option value="ROC_MCA">ROC / MCA</option>
                <option value="PF_ESI">PF & ESI</option>
                <option value="AUDIT">Audit Schedules</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Statutory Due Date *</label>
              <input
                type="date"
                required
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Filing Period</label>
              <input
                type="text"
                placeholder="e.g. Q1 FY 2026-27"
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client (Optional)</label>
              <select
                value={newClientId}
                onChange={(e) => setNewClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              >
                <option value="">All Firm Clients</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName || c.clientName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Late Fee / Penalty Details Note</label>
            <input
              type="text"
              placeholder="e.g. Late fee ₹50/day under Sec 47"
              value={newPenalty}
              onChange={(e) => setNewPenalty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg mt-2"
          >
            Create Compliance Item
          </button>
        </form>
      </Modal>
    </div>
  );
};
