// TEMPORARY: made-up numbers for the whole firm admin home, so it can be seen filled in before a firm
// has real data. Only used when someone turns on "Show sample data", always with a "Sample data" banner.
// To remove: delete this file, sampleInsights.js and SampleMode.jsx, and the sample switch in index.jsx
// and Insights.jsx.

const DAY_MS = 24 * 60 * 60 * 1000;
const inDays = (n) => new Date(Date.now() + n * DAY_MS).toISOString();
const client = (id, companyName) => ({ id: `s${id}`, clientName: companyName, companyName });
const person = (firstName, lastName) => ({ firstName, lastName });

/** Same shape as GET /firm-admin/home. Dates are relative to today so deadlines always look current. */
export const sampleHome = () => ({
  metrics: {
    totalClients: 48,
    totalUsers: 13,
    pendingTasks: 18,
    inProgressTasks: 11,
    completedTasks: 64,
    underReviewTasks: 5,
    pendingCompliance: 22,
  },
  compliance: [
    { id: 'sc1', title: 'GSTR-3B (October)', dueDate: inDays(-2), status: 'OVERDUE', client: client(1, 'Apex Technologies Pvt Ltd') },
    { id: 'sc2', title: 'TDS return Q2 (24Q)', dueDate: inDays(1), status: 'IN_PROGRESS', client: client(2, 'Kumar and Sons') },
    { id: 'sc3', title: 'GSTR-1 (October)', dueDate: inDays(3), status: 'UPCOMING', client: client(3, 'Shah Traders') },
    { id: 'sc4', title: 'ROC annual return (MGT-7)', dueDate: inDays(6), status: 'UPCOMING', client: client(4, 'Bo Industries LLP') },
  ],
  dueTasks: [
    { id: 'st1', title: 'Reconcile bank statements', dueDate: inDays(-1), status: 'IN_PROGRESS', priority: 'HIGH', client: client(5, 'Neha Foods'), user: person('Riya', 'Mehta') },
    { id: 'st2', title: 'Tax audit report draft', dueDate: inDays(0), status: 'UNDER_REVIEW', priority: 'HIGH', client: client(1, 'Apex Technologies Pvt Ltd'), user: person('Karan', 'Joshi') },
    { id: 'st3', title: 'Collect Form 16 documents', dueDate: inDays(2), status: 'PENDING', priority: 'MEDIUM', client: client(2, 'Kumar and Sons'), user: person('Priya', 'Nair') },
    { id: 'st4', title: 'Stock audit visit', dueDate: inDays(5), status: 'PENDING', priority: 'LOW', client: client(3, 'Shah Traders'), user: person('Aman', 'Verma') },
  ],
  invoices: { totalAmount: 3241000, paidAmount: 2925000, balanceAmount: 316300, overdueCount: 3 },
  leave: {
    pendingCount: 2,
    pending: [
      { id: 'sl1', leaveType: 'SICK_LEAVE', startDate: inDays(1), endDate: inDays(2), user: { id: 's21', ...person('Priya', 'Nair'), designation: 'Article assistant' } },
      { id: 'sl2', leaveType: 'CASUAL_LEAVE', startDate: inDays(8), endDate: inDays(8), user: { id: 's22', ...person('Aman', 'Verma'), designation: 'Audit associate' } },
    ],
  },
  attendance: { checkedIn: 11, team: 14 },
  recentUsers: [
    { id: 's31', ...person('Sneha', 'Rao'), designation: 'Article assistant', createdAt: inDays(-3) },
    { id: 's32', ...person('Vikram', 'Desai'), designation: 'Tax consultant', createdAt: inDays(-12) },
    { id: 's33', ...person('Karan', 'Joshi'), designation: 'Audit associate', createdAt: inDays(-25) },
  ],
  generatedAt: new Date().toISOString(),
});
