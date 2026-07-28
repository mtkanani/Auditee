import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ChartCard } from '../../components/common/ChartCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  FiDownload,
  FiPrinter,
  FiFilter,
  FiRefreshCw,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiDollarSign,
  FiAlertTriangle,
  FiPieChart,
  FiSliders,
  FiSearch,
  FiFileText,
  FiBriefcase,
  FiUsers,
  FiChevronRight,
  FiArrowUpRight,
  FiX,
  FiCheck,
  FiLayers,
  FiGrid,
  FiActivity,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getSummaryOverview, getReport, generateCustomReport, downloadReportCSV } from '../../services/reportService';
import axiosInstance from '../../services/axiosInstance';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [customReportData, setCustomReportData] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters
  const [dateRange, setDateRange] = useState('this_month');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Lists for dropdown filters
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);

  // Custom Report Builder state
  const [customEntity, setCustomEntity] = useState('tasks');
  const [customFields, setCustomFields] = useState(['id', 'taskCode', 'title', 'status', 'priority', 'clientName', 'assignees']);
  const [customLoading, setCustomLoading] = useState(false);

  // Available fields for Custom Report Builder
  const entityFieldsMap = {
    tasks: [
      { key: 'id', label: 'Task ID' },
      { key: 'taskCode', label: 'Task Code' },
      { key: 'title', label: 'Task Title' },
      { key: 'status', label: 'Status' },
      { key: 'priority', label: 'Priority' },
      { key: 'clientName', label: 'Client Name' },
      { key: 'assignees', label: 'Assigned Staff' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'createdAt', label: 'Creation Date' },
    ],
    clients: [
      { key: 'id', label: 'Client ID' },
      { key: 'clientName', label: 'Client Name' },
      { key: 'companyName', label: 'Company Name' },
      { key: 'email', label: 'Email Address' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'clientType', label: 'Client Type' },
      { key: 'status', label: 'Account Status' },
      { key: 'createdAt', label: 'Onboarded Date' },
    ],
    invoices: [
      { key: 'id', label: 'Invoice ID' },
      { key: 'invoiceNumber', label: 'Invoice #' },
      { key: 'clientName', label: 'Client Name' },
      { key: 'issueDate', label: 'Issue Date' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'status', label: 'Payment Status' },
      { key: 'totalAmount', label: 'Total Amount (₹)' },
    ],
    employees: [
      { key: 'id', label: 'Employee ID' },
      { key: 'name', label: 'Full Name' },
      { key: 'email', label: 'Work Email' },
      { key: 'designation', label: 'Designation' },
      { key: 'role', label: 'System Role' },
      { key: 'status', label: 'Account Status' },
      { key: 'createdAt', label: 'Join Date' },
    ],
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    if (activeTab === 'overview') {
      fetchOverview();
    } else if (activeTab === 'custom') {
      // Custom tab doesn't auto-fetch preset
    } else {
      fetchActiveReport();
    }
  }, [activeTab, dateRange, selectedEmployee, selectedClient, selectedStatus]);

  const fetchInitialData = async () => {
    try {
      const [empRes, clientRes] = await Promise.all([
        axiosInstance.get('/firm-admin/users').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/firm-admin/clients').catch(() => ({ data: { data: [] } })),
      ]);
      setEmployees(empRes.data?.data || empRes.data?.users || []);
      setClients(clientRes.data?.data || clientRes.data?.clients || []);
    } catch (e) {
      console.warn('Filter options fetch notice:', e.message);
    }
  };

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await getSummaryOverview();
      if (res?.data) {
        setSummary(res.data);
      }
    } catch (err) {
      toast.error('Failed to load summary analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveReport = async () => {
    setLoading(true);
    try {
      const params = {
        dateRange,
        employeeId: selectedEmployee,
        clientId: selectedClient,
        status: selectedStatus,
        search: searchQuery,
      };
      const res = await getReport(activeTab, params);
      setReportData(res?.data || []);
    } catch (err) {
      toast.error(`Failed to load ${activeTab} report`);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCustomReport = async () => {
    setCustomLoading(true);
    try {
      const config = {
        entity: customEntity,
        selectedFields: customFields,
        dateRange,
        status: selectedStatus,
      };
      const res = await generateCustomReport(config);
      setCustomReportData(res?.data || []);
      toast.success('Custom report generated successfully');
    } catch (err) {
      toast.error('Failed to generate custom report');
    } finally {
      setCustomLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      if (activeTab === 'custom') {
        const config = {
          entity: customEntity,
          selectedFields: customFields,
          dateRange,
          status: selectedStatus,
        };
        await downloadReportCSV('custom', {}, config);
      } else {
        const params = {
          dateRange,
          employeeId: selectedEmployee,
          clientId: selectedClient,
          status: selectedStatus,
        };
        await downloadReportCSV(activeTab, params);
      }
      toast.success('Report CSV downloaded');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetFilters = () => {
    setDateRange('this_month');
    setSelectedEmployee('');
    setSelectedClient('');
    setSelectedStatus('');
    setSearchQuery('');
    fetchActiveReport();
  };

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: FiActivity, color: 'text-indigo-400' },
    { id: 'pending-tasks', label: 'Pending Tasks', icon: FiClock, color: 'text-amber-400' },
    { id: 'completed-tasks', label: 'Completed Tasks', icon: FiCheckCircle, color: 'text-emerald-400' },
    { id: 'employee-performance', label: 'Staff Performance', icon: FiUser, color: 'text-purple-400' },
    { id: 'client-report', label: 'Client Directory', icon: FiBriefcase, color: 'text-blue-400' },
    { id: 'billing-report', label: 'Billing Invoices', icon: FiFileText, color: 'text-cyan-400' },
    { id: 'revenue-report', label: 'Revenue Trends', icon: FiTrendingUp, color: 'text-emerald-400' },
    { id: 'outstanding-payments', label: 'Outstanding Dues', icon: FiDollarSign, color: 'text-rose-400' },
    { id: 'compliance-report', label: 'Compliance Audit', icon: FiAlertTriangle, color: 'text-amber-400' },
    { id: 'custom', label: 'Custom Builder', icon: FiSliders, color: 'text-indigo-400' },
  ];

  // Pagination logic
  const totalPages = Math.ceil((activeTab === 'custom' ? customReportData.length : reportData.length) / rowsPerPage) || 1;
  const paginatedData = (activeTab === 'custom' ? customReportData : reportData).slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="space-y-8 pb-16 min-h-screen text-slate-100">
      {/* Hero Header Banner with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/70 border border-slate-800/80 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold uppercase tracking-widest mb-3">
              <FiActivity className="w-3.5 h-3.5" />
              <span>Enterprise Intelligence Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Firm Analytics & Audit Reports
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-medium">
              Real-time insights across billable time, staff performance, revenue growth, invoice collections, and tax compliance filings.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs font-bold hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2 shadow-md hover:shadow-indigo-500/10"
            >
              <FiPrinter className="w-4 h-4 text-indigo-400" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5"
            >
              <FiDownload className="w-4 h-4" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Pending Tasks', val: summary.totalPendingTasks, icon: FiClock, color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30', text: 'text-amber-400' },
            { label: 'Completed', val: summary.totalCompletedTasks, icon: FiCheckCircle, color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/30', text: 'text-emerald-400' },
            { label: 'Active Clients', val: summary.totalClients, icon: FiBriefcase, color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', text: 'text-blue-400' },
            { label: 'Firm Staff', val: summary.totalEmployees, icon: FiUsers, color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', text: 'text-purple-400' },
            { label: 'Total Billed', val: `₹${(summary.totalBilled || 0).toLocaleString()}`, icon: FiTrendingUp, color: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/30', text: 'text-cyan-400' },
            { label: 'Outstanding', val: `₹${(summary.outstandingAmount || 0).toLocaleString()}`, icon: FiDollarSign, color: 'from-rose-500/20 to-rose-500/5', border: 'border-rose-500/30', text: 'text-rose-400' },
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl bg-gradient-to-b ${kpi.color} border ${kpi.border} backdrop-blur-md hover:-translate-y-1 transition-all duration-300 shadow-lg group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors">
                    {kpi.label}
                  </span>
                  <div className={`p-2 rounded-xl bg-slate-950/60 ${kpi.text}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-black text-white tracking-tight">{kpi.val}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Segmented Pill Tabs Navigation */}
      <div className="p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xl overflow-x-auto scrollbar-none flex items-center gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      {activeTab !== 'overview' && activeTab !== 'custom' && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Date Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
              {[
                { id: 'all_time', label: 'All' },
                { id: 'today', label: 'Today' },
                { id: 'this_week', label: '7 Days' },
                { id: 'this_month', label: 'This Month' },
                { id: 'this_quarter', label: 'Quarter' },
                { id: 'this_year', label: 'This Year' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setDateRange(pill.id)}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
                    dateRange === pill.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Employee Filter */}
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Staff</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>

            {/* Client Filter */}
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Clients</option>
              {clients.map((cli) => (
                <option key={cli.id} value={cli.id}>
                  {cli.clientName || cli.companyName}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchActiveReport()}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <FiX className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={fetchActiveReport}
              className="py-2 px-4 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 font-medium text-xs flex flex-col items-center justify-center gap-4 bg-slate-900/60 rounded-3xl border border-slate-800/80 backdrop-blur-md">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <FiActivity className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-300 font-semibold text-sm">Aggregating live report metrics & dataset...</p>
        </div>
      ) : (
        <>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && summary && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Task & Audit Workload Metrics" subtitle="Pending vs Completed vs Compliance ratio">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={[
                        { name: 'Pending Tasks', count: summary.totalPendingTasks, fill: '#f59e0b' },
                        { name: 'Completed Tasks', count: summary.totalCompletedTasks, fill: '#10b981' },
                        { name: 'Compliance Filings', count: summary.totalComplianceItems, fill: '#6366f1' },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Billing vs Outstanding Collections" subtitle="Paid revenue vs pending invoice balance">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Paid Revenue', value: summary.paidBilled },
                          { name: 'Outstanding Dues', value: summary.outstandingAmount },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>
          )}

          {/* PRESET REPORTS DATA TABLE */}
          {activeTab !== 'overview' && activeTab !== 'custom' && (
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <FiLayers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      {tabs.find((t) => t.id === activeTab)?.label}
                    </h3>
                    <p className="text-xs text-slate-400">Total {reportData.length} records matching parameters</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>Show</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="py-1 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  >
                    <option value={10}>10 rows</option>
                    <option value={25}>25 rows</option>
                    <option value={50}>50 rows</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {reportData.length > 0 &&
                        Object.keys(reportData[0]).map((key) => (
                          <th key={key} className="py-3.5 px-4 whitespace-nowrap">
                            {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-xs font-medium text-slate-300">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="py-16 text-center text-slate-500">
                          <div className="flex flex-col items-center gap-2">
                            <FiSearch className="w-8 h-8 text-slate-600" />
                            <p className="text-slate-400 font-semibold">No records found</p>
                            <p className="text-slate-600 text-xs">Try adjusting your filters or date range</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          {Object.entries(row).map(([k, val], cIdx) => (
                            <td key={cIdx} className="py-3.5 px-4 whitespace-nowrap">
                              {typeof val === 'number' && (k.includes('Amount') || k.includes('Billed') || k.includes('Revenue') || k.includes('Balance') || k.includes('total')) ? (
                                <span className="font-bold text-emerald-400">₹{val.toLocaleString()}</span>
                              ) : k === 'status' || k === 'priority' ? (
                                <span
                                  className={`py-1 px-2.5 rounded-full text-[10px] font-bold tracking-wide inline-flex items-center gap-1 ${
                                    val === 'COMPLETED' || val === 'ACTIVE' || val === 'PAID'
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : val === 'OVERDUE' || val === 'HIGH' || val === 'UNPAID'
                                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  }`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                  {String(val)}
                                </span>
                              ) : (
                                String(val !== null && val !== undefined ? val : 'N/A')
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>
                  Showing page {currentPage} of {totalPages} ({reportData.length} total entries)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="py-1 px-3 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="py-1 px-3 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOM REPORT BUILDER */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <FiSliders className="w-5 h-5 text-indigo-400" />
                      <span>Custom Report Builder</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Configure data entities, select custom column attributes, and generate exported datasets.</p>
                  </div>
                </div>

                {/* Step 1: Entity Cards */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Step 1: Choose Primary Data Entity</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: 'tasks', label: 'Tasks & Workflow', desc: 'Audit tasks, assignees & deadlines', icon: FiClock, color: 'text-amber-400' },
                      { id: 'clients', label: 'Client Directory', desc: 'Client profiles & status', icon: FiBriefcase, color: 'text-blue-400' },
                      { id: 'invoices', label: 'Invoices & Billing', desc: 'Financial invoices & balances', icon: FiFileText, color: 'text-cyan-400' },
                      { id: 'employees', label: 'Staff & Staffing', desc: 'Employee productivity & roles', icon: FiUsers, color: 'text-purple-400' },
                    ].map((ent) => {
                      const Icon = ent.icon;
                      const isSelected = customEntity === ent.id;
                      return (
                        <button
                          key={ent.id}
                          onClick={() => {
                            setCustomEntity(ent.id);
                            setCustomFields(entityFieldsMap[ent.id].map((f) => f.key));
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                            isSelected
                              ? 'bg-gradient-to-b from-indigo-600/30 to-indigo-950/60 border-indigo-500 shadow-xl shadow-indigo-600/20'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-xl bg-slate-900 ${ent.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            {isSelected && <FiCheck className="w-4 h-4 text-indigo-400" />}
                          </div>
                          <p className="text-xs font-bold text-white">{ent.label}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{ent.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Custom Columns Selector Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Step 2: Select Attributes ({customFields.length} selected)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCustomFields(entityFieldsMap[customEntity].map((f) => f.key))}
                        className="text-xs text-indigo-400 font-bold hover:underline"
                      >
                        Select All
                      </button>
                      <span className="text-slate-600">•</span>
                      <button
                        onClick={() => setCustomFields([])}
                        className="text-xs text-slate-400 hover:text-slate-200"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    {entityFieldsMap[customEntity]?.map((f) => {
                      const isChecked = customFields.includes(f.key);
                      return (
                        <button
                          key={f.key}
                          onClick={() => {
                            if (isChecked) {
                              setCustomFields(customFields.filter((k) => k !== f.key));
                            } else {
                              setCustomFields([...customFields, f.key]);
                            }
                          }}
                          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                            isChecked
                              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {isChecked ? <FiCheck className="w-3.5 h-3.5 text-indigo-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                          <span>{f.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    onClick={handleRunCustomReport}
                    disabled={customLoading || customFields.length === 0}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-xl shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 transition-all flex items-center gap-2"
                  >
                    {customLoading ? (
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiCheckCircle className="w-4 h-4" />
                    )}
                    <span>Generate Custom Dataset</span>
                  </button>
                </div>
              </div>

              {/* Custom Report Results Table */}
              {customReportData.length > 0 && (
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-md">
                  <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Custom Dataset ({customReportData.length} rows)
                    </h4>

                    <button
                      onClick={handleExportCSV}
                      className="py-2 px-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 flex items-center gap-2"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>Export Custom CSV</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/80 border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {Object.keys(customReportData[0]).map((col) => (
                            <th key={col} className="py-3.5 px-4 whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 text-xs font-medium text-slate-300">
                        {customReportData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                            {Object.values(row).map((val, cIdx) => (
                              <td key={cIdx} className="py-3.5 px-4 whitespace-nowrap">
                                {String(val !== null && val !== undefined ? val : 'N/A')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
