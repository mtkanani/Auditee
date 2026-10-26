import {
  Activity,
  Briefcase,
  CircleCheckBig,
  Clock,
  DollarSign,
  FileText,
  SlidersVertical,
  TrendingUp,
  TriangleAlert,
  User,
  Users,
} from 'lucide-react';

export const entityFieldsMap = {
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

export const reportCategories = [
  {
    categoryName: 'Executive & Overview',
    tabs: [
      { id: 'overview', label: 'Executive Overview', icon: Activity, color: 'text-indigo-400' },
      { id: 'custom', label: 'Custom Builder', icon: SlidersVertical, color: 'text-indigo-400' },
    ],
  },
  {
    categoryName: 'Operations & Workload',
    tabs: [
      { id: 'pending-tasks', label: 'Pending Tasks', icon: Clock, color: 'text-amber-400' },
      { id: 'completed-tasks', label: 'Completed Tasks', icon: CircleCheckBig, color: 'text-emerald-400' },
      { id: 'employee-performance', label: 'Staff Performance', icon: User, color: 'text-purple-400' },
      { id: 'compliance-report', label: 'Compliance Audit', icon: TriangleAlert, color: 'text-amber-400' },
    ],
  },
  {
    categoryName: 'Finance & Clients',
    tabs: [
      { id: 'client-report', label: 'Client Directory', icon: Briefcase, color: 'text-blue-400' },
      { id: 'billing-report', label: 'Billing Invoices', icon: FileText, color: 'text-cyan-400' },
      { id: 'revenue-report', label: 'Revenue Trends', icon: TrendingUp, color: 'text-emerald-400' },
      { id: 'outstanding-payments', label: 'Outstanding Dues', icon: DollarSign, color: 'text-rose-400' },
    ],
  },
];

export const allTabs = reportCategories.flatMap((c) => c.tabs);

export const DATE_RANGE_PILLS = [
  { id: 'all_time', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: '7 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'this_quarter', label: 'Quarter' },
  { id: 'this_year', label: 'This Year' },
];

export const CUSTOM_ENTITIES = [
  { id: 'tasks', label: 'Tasks & Workflow', desc: 'Audit tasks, assignees & deadlines', icon: Clock, color: 'text-amber-400' },
  { id: 'clients', label: 'Client Directory', desc: 'Client profiles & status', icon: Briefcase, color: 'text-blue-400' },
  { id: 'invoices', label: 'Invoices & Billing', desc: 'Financial invoices & balances', icon: FileText, color: 'text-cyan-400' },
  { id: 'employees', label: 'Staff & Staffing', desc: 'Employee productivity & roles', icon: Users, color: 'text-purple-400' },
];

export const getKpiList = (summary) => [
  { label: 'Pending Tasks', val: summary.totalPendingTasks, icon: Clock, color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30', text: 'text-amber-400' },
  { label: 'Completed', val: summary.totalCompletedTasks, icon: CircleCheckBig, color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  { label: 'Active Clients', val: summary.totalClients, icon: Briefcase, color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', text: 'text-blue-400' },
  { label: 'Firm Staff', val: summary.totalEmployees, icon: Users, color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', text: 'text-purple-400' },
  { label: 'Total Billed', val: `₹${(summary.totalBilled || 0).toLocaleString()}`, icon: TrendingUp, color: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  { label: 'Outstanding', val: `₹${(summary.outstandingAmount || 0).toLocaleString()}`, icon: DollarSign, color: 'from-rose-500/20 to-rose-500/5', border: 'border-rose-500/30', text: 'text-rose-400' },
];
