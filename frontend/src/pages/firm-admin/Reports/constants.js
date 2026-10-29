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
      { id: 'overview', label: 'Executive Overview', icon: Activity },
      { id: 'custom', label: 'Custom Builder', icon: SlidersVertical },
    ],
  },
  {
    categoryName: 'Operations & Workload',
    tabs: [
      { id: 'pending-tasks', label: 'Pending Tasks', icon: Clock },
      { id: 'completed-tasks', label: 'Completed Tasks', icon: CircleCheckBig },
      { id: 'employee-performance', label: 'Staff Performance', icon: User },
      { id: 'compliance-report', label: 'Compliance Audit', icon: TriangleAlert },
    ],
  },
  {
    categoryName: 'Finance & Clients',
    tabs: [
      { id: 'client-report', label: 'Client Directory', icon: Briefcase },
      { id: 'billing-report', label: 'Billing Invoices', icon: FileText },
      { id: 'revenue-report', label: 'Revenue Trends', icon: TrendingUp },
      { id: 'outstanding-payments', label: 'Outstanding Dues', icon: DollarSign },
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
  { id: 'tasks', label: 'Tasks & Workflow', desc: 'Audit tasks, assignees & deadlines', icon: Clock },
  { id: 'clients', label: 'Client Directory', desc: 'Client profiles & status', icon: Briefcase },
  { id: 'invoices', label: 'Invoices & Billing', desc: 'Financial invoices & balances', icon: FileText },
  { id: 'employees', label: 'Staff & Staffing', desc: 'Employee productivity & roles', icon: Users },
];

// Headline numbers above the report tabs. tone feeds StatCard.
export const getKpiList = (summary) => [
  { label: 'Pending tasks', val: summary.totalPendingTasks, icon: Clock, tone: 'warning' },
  { label: 'Completed tasks', val: summary.totalCompletedTasks, icon: CircleCheckBig, tone: 'success' },
  { label: 'Active clients', val: summary.totalClients, icon: Briefcase, tone: 'accent' },
  { label: 'Staff', val: summary.totalEmployees, icon: Users, tone: 'neutral' },
  { label: 'Total billed', val: `₹${(summary.totalBilled || 0).toLocaleString('en-IN')}`, icon: TrendingUp, tone: 'accent' },
  { label: 'Outstanding', val: `₹${(summary.outstandingAmount || 0).toLocaleString('en-IN')}`, icon: DollarSign, tone: 'danger' },
];
