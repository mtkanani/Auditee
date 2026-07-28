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
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status' },
      { key: 'priority', label: 'Priority' },
      { key: 'clientName', label: 'Client Name' },
      { key: 'assignees', label: 'Assignees' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'createdAt', label: 'Created Date' },
    ],
    clients: [
      { key: 'id', label: 'Client ID' },
      { key: 'clientName', label: 'Client Name' },
      { key: 'companyName', label: 'Company Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'clientType', label: 'Type' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Registration Date' },
    ],
    invoices: [
      { key: 'id', label: 'Invoice ID' },
      { key: 'invoiceNumber', label: 'Invoice Number' },
      { key: 'clientName', label: 'Client Name' },
      { key: 'issueDate', label: 'Issue Date' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'status', label: 'Status' },
      { key: 'totalAmount', label: 'Total Amount' },
    ],
    employees: [
      { key: 'id', label: 'Employee ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'designation', label: 'Designation' },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Joined Date' },
    ],
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
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
      toast.success('Report CSV exported successfully');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiPieChart },
    { id: 'pending-tasks', label: 'Pending Tasks', icon: FiClock },
    { id: 'completed-tasks', label: 'Completed Tasks', icon: FiCheckCircle },
    { id: 'employee-performance', label: 'Staff Performance', icon: FiUser },
    { id: 'client-report', label: 'Client Report', icon: FiBriefcase },
    { id: 'billing-report', label: 'Billing Report', icon: FiFileText },
    { id: 'revenue-report', label: 'Revenue Report', icon: FiTrendingUp },
    { id: 'outstanding-payments', label: 'Outstanding', icon: FiDollarSign },
    { id: 'compliance-report', label: 'Compliance', icon: FiAlertTriangle },
    { id: 'custom', label: 'Custom Builder', icon: FiSliders },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="Firm Performance & Audit Reports Center"
        subtitle="Real-time business analytics, staff productivity, revenue trends, and compliance metrics"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <FiPrinter className="w-4 h-4 text-indigo-400" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {/* Overview KPI Cards Banner */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <FiClock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Tasks</span>
            </div>
            <p className="text-2xl font-black text-white">{summary.totalPendingTasks || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <FiCheckCircle className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            </div>
            <p className="text-2xl font-black text-white">{summary.totalCompletedTasks || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <FiBriefcase className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Clients</span>
            </div>
            <p className="text-2xl font-black text-white">{summary.totalClients || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <FiUsers className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Staff Members</span>
            </div>
            <p className="text-2xl font-black text-white">{summary.totalEmployees || 0}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <FiTrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Billed</span>
            </div>
            <p className="text-xl font-black text-white">₹{(summary.totalBilled || 0).toLocaleString()}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center gap-2 text-rose-400 mb-1">
              <FiDollarSign className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Outstanding</span>
            </div>
            <p className="text-xl font-black text-rose-400">₹{(summary.outstandingAmount || 0).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar (Not shown for overview or custom builder) */}
      {activeTab !== 'overview' && activeTab !== 'custom' && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <FiFilter className="w-4 h-4 text-indigo-400" />
            <span>Filters:</span>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <FiCalendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="all_time">All Time</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
          </div>

          {/* Employee Filter */}
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Staff / Employees</option>
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
            className="py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Clients</option>
            {clients.map((cli) => (
              <option key={cli.id} value={cli.id}>
                {cli.clientName || cli.companyName}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="flex-1 min-w-[200px] relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search in report..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchActiveReport()}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={fetchActiveReport}
            className="py-1.5 px-3 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 flex items-center gap-1.5"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium text-xs flex flex-col items-center gap-3">
          <FiRefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
          <span>Generating and fetching analytics report data...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && summary && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Overall Task Status Metrics" subtitle="Pending vs Completed Tasks ratio">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Pending Tasks', count: summary.totalPendingTasks, fill: '#f59e0b' },
                      { name: 'Completed Tasks', count: summary.totalCompletedTasks, fill: '#10b981' },
                      { name: 'Compliance Items', count: summary.totalComplianceItems, fill: '#6366f1' },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Financial Billed vs Outstanding" subtitle="Billed revenue vs pending invoice collections">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Paid Revenue', value: summary.paidBilled },
                        { name: 'Outstanding Payments', value: summary.outstandingAmount },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
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
          )}

          {/* TAB 2-9: PRESET REPORTS DATA TABLE & CHARTS */}
          {activeTab !== 'overview' && activeTab !== 'custom' && (
            <div className="space-y-6">
              {/* Report Table Card */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    {tabs.find((t) => t.id === activeTab)?.label} Data ({reportData.length} entries)
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {reportData.length > 0 &&
                          Object.keys(reportData[0]).map((key) => (
                            <th key={key} className="py-3 px-4">
                              {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-xs font-medium text-slate-300">
                      {reportData.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="py-12 text-center text-slate-500 font-normal">
                            No entries found matching current filter criteria.
                          </td>
                        </tr>
                      ) : (
                        reportData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            {Object.entries(row).map(([k, val], cIdx) => (
                              <td key={cIdx} className="py-3.5 px-4 whitespace-nowrap">
                                {typeof val === 'number' && (k.includes('Amount') || k.includes('Billed') || k.includes('Revenue') || k.includes('Balance')) ? (
                                  <span className="font-bold text-emerald-400">₹{val.toLocaleString()}</span>
                                ) : k === 'status' || k === 'priority' ? (
                                  <span
                                    className={`py-1 px-2.5 rounded-full text-[10px] font-bold tracking-wide ${
                                      val === 'COMPLETED' || val === 'ACTIVE' || val === 'PAID'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : val === 'OVERDUE' || val === 'HIGH' || val === 'UNPAID'
                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}
                                  >
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
              </div>
            </div>
          )}

          {/* TAB 10: CUSTOM REPORT BUILDER */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FiSliders className="w-5 h-5 text-indigo-400" />
                  <span>Custom Report Builder</span>
                </h3>

                {/* Entity Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">1. Select Data Entity</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: 'tasks', label: 'Tasks Data' },
                      { id: 'clients', label: 'Clients Data' },
                      { id: 'invoices', label: 'Invoices & Billing' },
                      { id: 'employees', label: 'Staff / Employees' },
                    ].map((ent) => (
                      <button
                        key={ent.id}
                        onClick={() => {
                          setCustomEntity(ent.id);
                          setCustomFields(entityFieldsMap[ent.id].map((f) => f.key));
                        }}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                          customEntity === ent.id
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                            : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {ent.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Columns Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">2. Select Custom Columns to Include</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    {entityFieldsMap[customEntity]?.map((f) => {
                      const isChecked = customFields.includes(f.key);
                      return (
                        <label key={f.key} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-300">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCustomFields([...customFields, f.key]);
                              } else {
                                setCustomFields(customFields.filter((k) => k !== f.key));
                              }
                            }}
                            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0"
                          />
                          <span>{f.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleRunCustomReport}
                    disabled={customLoading}
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg hover:from-indigo-500 hover:to-purple-500 flex items-center gap-2"
                  >
                    {customLoading ? (
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiCheckCircle className="w-4 h-4" />
                    )}
                    <span>Generate Custom Report</span>
                  </button>
                </div>
              </div>

              {/* Custom Report Results Table */}
              {customReportData.length > 0 && (
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-xl">
                  <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                      Custom Generated Report ({customReportData.length} rows)
                    </h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {Object.keys(customReportData[0]).map((col) => (
                            <th key={col} className="py-3 px-4">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 text-xs font-medium text-slate-300">
                        {customReportData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            {Object.values(row).map((val, cIdx) => (
                              <td key={cIdx} className="py-3 px-4 whitespace-nowrap">
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
