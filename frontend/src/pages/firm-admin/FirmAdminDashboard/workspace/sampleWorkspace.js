// TEMPORARY: made-up numbers for the home widgets (same shape as GET /firm-admin/home/workspace).
// Only used in sample mode, always under the "Sample data" banner. See ../sampleHome.js to remove.

const DAY_MS = 24 * 60 * 60 * 1000;
const inDays = (n, hour) => {
  const d = new Date(Date.now() + n * DAY_MS);
  if (hour !== undefined) d.setHours(hour, hour % 1 ? 30 : 0, 0, 0);
  return d.toISOString();
};
const ago = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

const CALENDAR = [
  [1, 'GSTR-1 (October)', 'GST', 'Shah Traders'],
  [1, 'GSTR-1 (October)', 'GST', 'Neha Foods'],
  [3, 'TDS payment (October)', 'TDS', null],
  [5, 'PF and ESI deposit', 'PAYROLL', 'Apex Technologies Pvt Ltd'],
  [8, 'GSTR-3B (October)', 'GST', 'Apex Technologies Pvt Ltd'],
  [8, 'GSTR-3B (October)', 'GST', 'Kumar and Sons'],
  [8, 'GSTR-3B (October)', 'GST', 'Bo Industries LLP'],
  [13, 'Advance tax instalment', 'INCOME_TAX', 'Kumar and Sons'],
  [18, 'ROC annual return (MGT-7)', 'ROC', 'Bo Industries LLP'],
  [23, 'TDS return Q2 (26Q)', 'TDS', 'Shah Traders'],
  [28, 'Tax audit report (3CD)', 'INCOME_TAX', 'Neha Foods'],
];

export const sampleWorkspace = () => ({
  readyToBill: {
    clientCount: 4,
    taskCount: 11,
    clients: [
      { clientId: 's1', name: 'Apex Technologies Pvt Ltd', tasks: 4, lastDone: inDays(-1), lastInvoice: inDays(-38), monthlyFee: 25000 },
      { clientId: 's2', name: 'Kumar and Sons', tasks: 3, lastDone: inDays(-2), lastInvoice: inDays(-33), monthlyFee: 12000 },
      { clientId: 's3', name: 'Shah Traders', tasks: 2, lastDone: inDays(-4), lastInvoice: null, monthlyFee: 8000 },
      { clientId: 's4', name: 'Neha Foods', tasks: 2, lastDone: inDays(-6), lastInvoice: inDays(-41), monthlyFee: 0 },
    ],
  },
  workload: [
    { userId: 's21', name: 'Riya Mehta', designation: 'Senior associate', open: 9, overdue: 2, dueWeek: 4 },
    { userId: 's22', name: 'Karan Joshi', designation: 'Audit associate', open: 7, overdue: 1, dueWeek: 3 },
    { userId: 's23', name: 'Priya Nair', designation: 'Article assistant', open: 5, overdue: 0, dueWeek: 2 },
    { userId: 's24', name: 'Aman Verma', designation: 'Audit associate', open: 4, overdue: 0, dueWeek: 1 },
    { userId: 's25', name: 'Vikram Desai', designation: 'Tax consultant', open: 2, overdue: 0, dueWeek: 0 },
    { userId: 's26', name: 'Sneha Rao', designation: 'Article assistant', open: 0, overdue: 0, dueWeek: 0 },
  ],
  aging: {
    buckets: [
      { key: 'current', label: 'Not yet due', amount: 142000, count: 6 },
      { key: 'd30', label: '1–30 days', amount: 88500, count: 3 },
      { key: 'd60', label: '31–60 days', amount: 52000, count: 2 },
      { key: 'd90', label: '61–90 days', amount: 18400, count: 1 },
      { key: 'd90plus', label: '90+ days', amount: 15400, count: 1 },
    ],
    oldest: [
      { invoiceId: 's41', invoiceNumber: 'INV-2026-0042', clientName: 'Neha Foods', hasEmail: true, balance: 15400, daysOverdue: 104 },
      { invoiceId: 's42', invoiceNumber: 'INV-2026-0067', clientName: 'Bo Industries LLP', hasEmail: true, balance: 18400, daysOverdue: 71 },
      { invoiceId: 's43', invoiceNumber: 'INV-2026-0081', clientName: 'Kumar and Sons', hasEmail: true, balance: 29500, daysOverdue: 44 },
      { invoiceId: 's44', invoiceNumber: 'INV-2026-0090', clientName: 'Apex Technologies Pvt Ltd', hasEmail: false, balance: 22500, daysOverdue: 12 },
    ],
  },
  calendar: CALENDAR.map(([d, title, category, client], i) => ({ id: `sc${i}`, title, category, status: 'UPCOMING', dueDate: inDays(d), client })),
  agenda: {
    meetings: [
      { id: 's51', title: 'Tax planning review · Apex Technologies', startTime: inDays(0, 11), endTime: inDays(0, 12), meetingMode: 'IN_APP_VIDEO', status: 'SCHEDULED' },
      { id: 's52', title: 'Team stand-up', startTime: inDays(0, 16.5), endTime: inDays(0, 17), meetingMode: 'IN_PERSON', location: 'Office', status: 'SCHEDULED' },
    ],
    onLeave: [{ id: 's53', name: 'Vikram Desai', leaveType: 'CASUAL_LEAVE', endDate: inDays(1) }],
    dueToday: [
      { key: 'st1', kind: 'task', title: 'Tax audit report draft', who: 'Apex Technologies Pvt Ltd · Karan Joshi' },
      { key: 'sc1', kind: 'filing', title: 'Professional tax return', who: 'Kumar and Sons' },
    ],
  },
  target: { monthlyTarget: 500000, billed: 318000, invoices: 9, month: new Date().toISOString().slice(0, 7), daysLeft: 12 },
  documents: {
    pending: 5,
    items: [
      { id: 's61', title: 'Bank statements (October)', client: 'Shah Traders', dueDate: inDays(-1), requestedAt: inDays(-6), lastRemindedAt: inDays(-2) },
      { id: 's62', title: 'Purchase invoices Q2', client: 'Neha Foods', dueDate: inDays(2), requestedAt: inDays(-4), lastRemindedAt: null },
      { id: 's63', title: 'Form 16 and investment proofs', client: 'Kumar and Sons', dueDate: inDays(5), requestedAt: inDays(-3), lastRemindedAt: null },
      { id: 's64', title: 'Fixed asset register', client: 'Bo Industries LLP', dueDate: null, requestedAt: inDays(-9), lastRemindedAt: null },
    ],
  },
  leads: {
    stages: [
      { stage: 'NEW_LEAD', count: 9, value: 340000 },
      { stage: 'DISCUSSION', count: 6, value: 410000 },
      { stage: 'PROPOSAL_SENT', count: 4, value: 285000 },
      { stage: 'WON', count: 14, value: 960000 },
    ],
    pipelineValue: 1035000,
    wonThisMonth: 2,
    lostThisMonth: 1,
    conversion: 64,
  },
  activity: [
    { id: 'sa1', kind: 'task', actor: 'Riya Mehta', text: 'moved GSTR-3B (October) to completed', at: ago(4) },
    { id: 'sa2', kind: 'payment', actor: 'Kumar and Sons', text: 'paid ₹25,000 on INV-2026-0081', at: ago(26) },
    { id: 'sa3', kind: 'document', actor: 'Shah Traders', text: 'uploaded Bank statement (September)', at: ago(70) },
    { id: 'sa4', kind: 'task', actor: 'Karan Joshi', text: 'commented on Tax audit report draft', at: ago(140) },
    { id: 'sa5', kind: 'client', actor: 'Asha Patel', text: 'Added new client · Bo Industries LLP', at: ago(300) },
    { id: 'sa6', kind: 'task', actor: 'Priya Nair', text: 'created Collect Form 16 documents', at: ago(1440) },
  ],
});
