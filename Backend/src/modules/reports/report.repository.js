/**
 * OPTIMIZED drop-in replacement for:
 *   Backend/src/modules/reports/report.repository.js
 *
 * Same method names, same response shapes — the controller/service/frontend
 * need no changes.
 *
 * What changed (n = rows in a table, C = clients, U = users):
 *  - getSummaryOverview : loaded EVERY invoice row into Node to sum it      -> groupBy in DB (returns ~5 rows)
 *  - getClientReport    : 1 + 2*C queries (N+1 problem)                     -> 3 queries total, any C
 *  - getEmployeePerformance: loaded every task + time entry of every user   -> 1 SQL GROUP BY + 1 groupBy
 *  - getCompletedTasks  : loaded every time entry of every task             -> 1 groupBy
 *  - getOutstandingPayments: loaded every payment row                       -> uses invoice.paidAmount column
 *
 * Bugs fixed on the way (these reports were throwing errors before):
 *  - TimeEntry has `hours`, not `durationMinutes` / `isBillable`
 *  - Client relation is `assignments`, not `clientAssignments`
 *  - Invoice has `subTotal` + cgst/sgst/igst, not `subtotal` / `taxAmount`
 */
const { Prisma } = require('@prisma/client');
const prisma = require('../../config/db');

const OUTSTANDING_STATUSES = ['UNPAID', 'OVERDUE', 'PARTIALLY_PAID'];
const round1 = (n) => Number((Number(n) || 0).toFixed(1));
const round2 = (n) => Number((Number(n) || 0).toFixed(2));
const toFirmId = (firmId) => (firmId && !isNaN(Number(firmId)) ? Number(firmId) : undefined);

class ReportRepository {
  _getDateRangeFilter(dateRange, customStart, customEnd) {
    const now = new Date();
    let startDate = null;
    let endDate = null;

    if (dateRange === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (dateRange === 'this_week') {
      const dayOfWeek = now.getDay();
      const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.getFullYear(), now.getMonth(), diffToMonday);
      endDate = new Date();
    } else if (dateRange === 'this_month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date();
    } else if (dateRange === 'this_quarter') {
      startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      endDate = new Date();
    } else if (dateRange === 'this_year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date();
    } else if (dateRange === 'custom' && (customStart || customEnd)) {
      if (customStart) startDate = new Date(customStart);
      if (customEnd) {
        endDate = new Date(customEnd);
        endDate.setHours(23, 59, 59, 999);
      }
    }

    const dateFilter = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;
    return Object.keys(dateFilter).length > 0 ? dateFilter : null;
  }

  /**
   * Summary overview — 5 small aggregate queries in parallel,
   * nothing row-by-row comes back to Node.
   */
  async getSummaryOverview(firmId) {
    const fId = toFirmId(firmId);
    const whereFirm = fId ? { firmId: fId } : {};

    try {
      const [taskGroups, totalClients, totalEmployees, invoiceGroups, complianceGroups] = await Promise.all([
        prisma.task.groupBy({
          by: ['status'],
          where: { ...whereFirm, deletedAt: null },
          _count: { _all: true },
        }),
        prisma.client.count({ where: { ...whereFirm, deletedAt: null } }),
        prisma.user.count({
          where: { ...whereFirm, deletedAt: null, role: { in: ['USER', 'EMPLOYEE', 'FIRM_ADMIN'] } },
        }),
        prisma.invoice.groupBy({
          by: ['status'],
          where: { ...whereFirm, deletedAt: null },
          _sum: { totalAmount: true },
        }),
        prisma.complianceItem.groupBy({
          by: ['status'],
          where: whereFirm,
          _count: { _all: true },
        }),
      ]);

      let totalPendingTasks = 0;
      let totalCompletedTasks = 0;
      for (const g of taskGroups) {
        if (g.status === 'COMPLETED') totalCompletedTasks += g._count._all;
        else if (g.status !== 'CANCELLED') totalPendingTasks += g._count._all;
      }

      let totalBilled = 0;
      let paidBilled = 0;
      let outstandingAmount = 0;
      for (const g of invoiceGroups) {
        const sum = Number(g._sum.totalAmount) || 0;
        totalBilled += sum;
        if (g.status === 'PAID') paidBilled += sum;
        if (OUTSTANDING_STATUSES.includes(g.status)) outstandingAmount += sum;
      }

      let totalComplianceItems = 0;
      let overdueComplianceItems = 0;
      for (const g of complianceGroups) {
        totalComplianceItems += g._count._all;
        if (g.status === 'OVERDUE') overdueComplianceItems += g._count._all;
      }

      return {
        totalPendingTasks,
        totalCompletedTasks,
        totalClients,
        totalEmployees,
        totalBilled: round2(totalBilled),
        paidBilled: round2(paidBilled),
        outstandingAmount: round2(outstandingAmount),
        totalComplianceItems,
        overdueComplianceItems,
      };
    } catch (error) {
      console.error('Error in getSummaryOverview:', error);
      return {
        totalPendingTasks: 0, totalCompletedTasks: 0, totalClients: 0, totalEmployees: 0,
        totalBilled: 0, paidBilled: 0, outstandingAmount: 0,
        totalComplianceItems: 0, overdueComplianceItems: 0,
      };
    }
  }

  /** 1. Pending Tasks — already a single query; trimmed the selected columns. */
  async getPendingTasks(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, employeeId, clientId, priority, search } = queryParams;
    const where = { deletedAt: null, status: { notIn: ['COMPLETED', 'CANCELLED'] } };

    if (firmId) where.firmId = Number(firmId);
    if (priority) where.priority = priority;
    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);
    if (dateFilter) where.createdAt = dateFilter;
    if (clientId) where.clientId = Number(clientId);
    if (employeeId) where.assignees = { some: { userId: Number(employeeId) } };
    if (search) {
      where.OR = [{ title: { contains: search, mode: 'insensitive' } }];
    }

    const tasks = await prisma.task.findMany({
      where,
      select: {
        id: true, title: true, status: true, priority: true, dueDate: true, createdAt: true,
        client: { select: { clientName: true, companyName: true } },
        assignees: { select: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { dueDate: 'asc' },
    });

    const now = Date.now();
    return tasks.map((t) => {
      const due = t.dueDate ? t.dueDate.getTime() : null;
      const isOverdue = due !== null && due < now;
      return {
        taskId: t.id,
        taskCode: `TSK-${t.id}`,
        title: t.title,
        status: isOverdue ? 'OVERDUE' : t.status,
        priority: t.priority,
        clientName: t.client?.clientName || t.client?.companyName || 'N/A',
        assignees: t.assignees.map((a) => `${a.user.firstName} ${a.user.lastName}`).join(', ') || 'Unassigned',
        dueDate: t.dueDate,
        createdAt: t.createdAt,
        delayDays: isOverdue ? Math.floor((now - due) / 86400000) : 0,
      };
    });
  }

  /** 2. Completed Tasks — hours summed in DB with ONE groupBy instead of loading every time entry. */
  async getCompletedTasks(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, employeeId, clientId, search } = queryParams;
    const where = { deletedAt: null, status: 'COMPLETED' };

    if (firmId) where.firmId = Number(firmId);
    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);
    if (dateFilter) where.updatedAt = dateFilter;
    if (clientId) where.clientId = Number(clientId);
    if (employeeId) where.assignees = { some: { userId: Number(employeeId) } };
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }];

    const tasks = await prisma.task.findMany({
      where,
      select: {
        id: true, title: true, priority: true, updatedAt: true,
        client: { select: { clientName: true, companyName: true } },
        assignees: { select: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    if (tasks.length === 0) return [];

    const hourSums = await prisma.timeEntry.groupBy({
      by: ['taskId'],
      where: { taskId: { in: tasks.map((t) => t.id) } },
      _sum: { hours: true },
    });
    const hoursByTask = new Map(hourSums.map((h) => [h.taskId, Number(h._sum.hours) || 0])); // O(1) lookup

    return tasks.map((t) => ({
      taskId: t.id,
      taskCode: `TSK-${t.id}`,
      title: t.title,
      priority: t.priority,
      clientName: t.client?.clientName || t.client?.companyName || 'N/A',
      assignees: t.assignees.map((a) => `${a.user.firstName} ${a.user.lastName}`).join(', ') || 'N/A',
      completedAt: t.updatedAt,
      hoursSpent: round1(hoursByTask.get(t.id) || 0),
    }));
  }

  /**
   * 3. Employee Performance
   * BEFORE: pulled every task + every time entry of every user into Node, then filtered in JS.
   *         Cost ~ O(users x their tasks + users x their entries) of data over the network.
   * AFTER : 3 queries; Postgres does the counting with indexes. Data returned = 1 row per user.
   */
  async getEmployeePerformance(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, employeeId, search } = queryParams;
    const fId = toFirmId(firmId);

    const whereUser = { deletedAt: null };
    if (fId) whereUser.firmId = fId;
    if (employeeId) whereUser.id = Number(employeeId);
    if (search) {
      whereUser.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereUser,
      select: { id: true, firstName: true, lastName: true, email: true, designation: true },
    });
    if (users.length === 0) return [];

    const userIds = users.map((u) => u.id);
    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);

    const conditions = [
      Prisma.sql`t."deletedAt" IS NULL`,
      Prisma.sql`ta."userId" IN (${Prisma.join(userIds)})`,
    ];
    if (fId) conditions.push(Prisma.sql`t."firmId" = ${fId}`);
    if (dateFilter?.gte) conditions.push(Prisma.sql`t."createdAt" >= ${dateFilter.gte}`);
    if (dateFilter?.lte) conditions.push(Prisma.sql`t."createdAt" <= ${dateFilter.lte}`);

    const timeWhere = { userId: { in: userIds } };
    if (dateFilter) timeWhere.createdAt = dateFilter;

    const [taskStats, timeStats] = await Promise.all([
      prisma.$queryRaw`
        SELECT ta."userId"                                        AS "userId",
               COUNT(*)::int                                      AS "total",
               COUNT(*) FILTER (WHERE t.status = 'COMPLETED')::int AS "completed"
        FROM task_assignees ta
        JOIN tasks t ON t.id = ta."taskId"
        WHERE ${Prisma.join(conditions, ' AND ')}
        GROUP BY ta."userId"`,
      prisma.timeEntry.groupBy({
        by: ['userId'],
        where: timeWhere,
        _sum: { hours: true },
      }),
    ]);

    const tasksByUser = new Map(taskStats.map((r) => [r.userId, r]));
    const hoursByUser = new Map(timeStats.map((r) => [r.userId, Number(r._sum.hours) || 0]));

    return users.map((u) => {
      const stats = tasksByUser.get(u.id) || { total: 0, completed: 0 };
      const totalAssigned = Number(stats.total);
      const completedCount = Number(stats.completed);
      const loggedHours = round1(hoursByUser.get(u.id) || 0);
      return {
        employeeId: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        designation: u.designation || 'Staff Member',
        totalAssigned,
        completedCount,
        pendingCount: totalAssigned - completedCount,
        completionRate: totalAssigned > 0 ? round1((completedCount / totalAssigned) * 100) : 0,
        loggedHours,
        // NOTE: TimeEntry has no `isBillable` column yet, so all logged hours are treated as billable.
        // Add `isBillable Boolean @default(true)` to TimeEntry and a `where` here if you need the split.
        billableHours: loggedHours,
      };
    });
  }

  /**
   * 4. Client Report
   * BEFORE: Promise.all(clients.map(...)) fired 2 queries PER client  -> 1 + 2C queries
   *         (500 clients = 1,001 queries and it can exhaust the DB connection pool).
   * AFTER : 3 queries total regardless of client count.
   */
  async getClientReport(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, clientId, search } = queryParams;
    const where = { deletedAt: null };
    if (firmId) where.firmId = Number(firmId);
    if (clientId) where.id = Number(clientId);
    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      select: {
        id: true, clientName: true, companyName: true, email: true, phone: true,
        clientType: true, status: true, createdAt: true,
        _count: { select: { assignments: true } },
      },
    });
    if (clients.length === 0) return [];

    const clientIds = clients.map((c) => c.id);
    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);

    const taskWhere = { clientId: { in: clientIds }, deletedAt: null };
    if (dateFilter) taskWhere.createdAt = dateFilter;
    const invoiceWhere = { clientId: { in: clientIds }, deletedAt: null };
    if (dateFilter) invoiceWhere.issueDate = dateFilter;

    const [taskGroups, invoiceGroups] = await Promise.all([
      prisma.task.groupBy({ by: ['clientId', 'status'], where: taskWhere, _count: { _all: true } }),
      prisma.invoice.groupBy({ by: ['clientId', 'status'], where: invoiceWhere, _sum: { totalAmount: true } }),
    ]);

    // Build O(1) lookup maps: clientId -> aggregates
    const taskAgg = new Map();
    for (const g of taskGroups) {
      const a = taskAgg.get(g.clientId) || { total: 0, completed: 0 };
      a.total += g._count._all;
      if (g.status === 'COMPLETED') a.completed += g._count._all;
      taskAgg.set(g.clientId, a);
    }
    const invAgg = new Map();
    for (const g of invoiceGroups) {
      const a = invAgg.get(g.clientId) || { billed: 0, outstanding: 0 };
      const sum = Number(g._sum.totalAmount) || 0;
      a.billed += sum;
      if (OUTSTANDING_STATUSES.includes(g.status)) a.outstanding += sum;
      invAgg.set(g.clientId, a);
    }

    return clients.map((c) => {
      const t = taskAgg.get(c.id) || { total: 0, completed: 0 };
      const i = invAgg.get(c.id) || { billed: 0, outstanding: 0 };
      return {
        clientId: c.id,
        clientName: c.clientName,
        companyName: c.companyName || 'N/A',
        email: c.email,
        phone: c.phone || 'N/A',
        clientType: c.clientType,
        status: c.status,
        assignedStaffCount: c._count.assignments,
        totalTasks: t.total,
        activeTasks: t.total - t.completed,
        completedTasks: t.completed,
        totalBilled: round2(i.billed),
        outstandingBalance: round2(i.outstanding),
        createdAt: c.createdAt,
      };
    });
  }

  /** 5. Billing Report — no longer loads invoice items it never used; field names fixed. */
  async getBillingReport(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, status, clientId, search } = queryParams;
    const where = { deletedAt: null };
    if (firmId) where.firmId = Number(firmId);
    if (status) where.status = status;
    if (clientId) where.clientId = Number(clientId);
    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);
    if (dateFilter) where.issueDate = dateFilter;
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { client: { clientName: { contains: search, mode: 'insensitive' } } },
        { client: { companyName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      select: {
        id: true, invoiceNumber: true, issueDate: true, dueDate: true, status: true, notes: true,
        subTotal: true, cgstAmount: true, sgstAmount: true, igstAmount: true, totalAmount: true,
        client: { select: { clientName: true, companyName: true } },
      },
      orderBy: { issueDate: 'desc' },
    });

    return invoices.map((inv) => ({
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber || `INV-${inv.id}`,
      clientName: inv.client?.clientName || inv.client?.companyName || 'N/A',
      issueDate: inv.issueDate,
      dueDate: inv.dueDate,
      status: inv.status,
      subtotal: Number(inv.subTotal) || 0,
      taxAmount: round2((inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.igstAmount || 0)),
      totalAmount: Number(inv.totalAmount) || 0,
      notes: inv.notes || '',
    }));
  }

  /** 6. Revenue Report — only selects the columns it uses. */
  async getRevenueReport(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd } = queryParams;
    const where = { deletedAt: null };
    if (firmId) where.firmId = Number(firmId);
    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);

    const payments = await prisma.paymentRecord.findMany({
      where: { invoice: where, ...(dateFilter ? { paymentDate: dateFilter } : {}) },
      select: {
        id: true, invoiceId: true, amount: true, paymentDate: true, paymentMode: true, referenceNumber: true,
        invoice: { select: { invoiceNumber: true, client: { select: { clientName: true, companyName: true } } } },
      },
      orderBy: { paymentDate: 'desc' },
    });

    // Only hit the invoices table if there are no payment records (old fallback behaviour)
    const paidInvoices = payments.length === 0
      ? await prisma.invoice.findMany({
          where: { ...where, status: 'PAID', ...(dateFilter ? { updatedAt: dateFilter } : {}) },
          select: { totalAmount: true, updatedAt: true },
        })
      : [];

    const revenueByMonth = {};
    const revenueByPaymentMode = {};
    let totalRevenue = 0;
    const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    for (const p of payments) {
      const amount = Number(p.amount) || 0;
      totalRevenue += amount;
      const k = monthKey(new Date(p.paymentDate));
      revenueByMonth[k] = (revenueByMonth[k] || 0) + amount;
      const mode = p.paymentMode || 'OTHER';
      revenueByPaymentMode[mode] = (revenueByPaymentMode[mode] || 0) + amount;
    }
    for (const inv of paidInvoices) {
      const amount = Number(inv.totalAmount) || 0;
      totalRevenue += amount;
      const k = monthKey(new Date(inv.updatedAt));
      revenueByMonth[k] = (revenueByMonth[k] || 0) + amount;
      revenueByPaymentMode.BANK_TRANSFER = (revenueByPaymentMode.BANK_TRANSFER || 0) + amount;
    }

    return {
      totalRevenue: round2(totalRevenue),
      monthlyTrends: Object.keys(revenueByMonth).sort().map((month) => ({ month, revenue: round2(revenueByMonth[month]) })),
      paymentModeBreakdown: Object.keys(revenueByPaymentMode).map((mode) => ({ mode, amount: round2(revenueByPaymentMode[mode]) })),
      recentTransactions: payments.map((p) => ({
        paymentId: p.id,
        invoiceNumber: p.invoice?.invoiceNumber || `INV-${p.invoiceId}`,
        clientName: p.invoice?.client?.clientName || p.invoice?.client?.companyName || 'N/A',
        amount: Number(p.amount),
        paymentMode: p.paymentMode,
        referenceNumber: p.referenceNumber || 'N/A',
        paymentDate: p.paymentDate,
      })),
    };
  }

  /**
   * 7. Outstanding Payments
   * BEFORE: loaded every PaymentRecord of every unpaid invoice and summed in JS.
   * AFTER : invoice.service already maintains `paidAmount` on the invoice — just read it.
   */
  async getOutstandingPayments(firmId, queryParams = {}) {
    const { clientId, search } = queryParams;
    const where = { deletedAt: null, status: { in: OUTSTANDING_STATUSES } };
    if (firmId) where.firmId = Number(firmId);
    if (clientId) where.clientId = Number(clientId);
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { client: { clientName: { contains: search, mode: 'insensitive' } } },
        { client: { companyName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      select: {
        id: true, invoiceNumber: true, issueDate: true, dueDate: true, status: true,
        totalAmount: true, paidAmount: true,
        client: { select: { clientName: true, companyName: true, email: true, phone: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    const now = Date.now();
    return invoices.map((inv) => {
      const totalAmount = Number(inv.totalAmount) || 0;
      const paidTotal = Number(inv.paidAmount) || 0;
      const due = new Date(inv.dueDate).getTime();
      const isOverdue = due < now;
      return {
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber || `INV-${inv.id}`,
        clientName: inv.client?.clientName || inv.client?.companyName || 'N/A',
        email: inv.client?.email || 'N/A',
        phone: inv.client?.phone || 'N/A',
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        totalAmount,
        paidAmount: round2(paidTotal),
        outstandingAmount: round2(Math.max(0, totalAmount - paidTotal)),
        status: isOverdue ? 'OVERDUE' : inv.status,
        overdueDays: isOverdue ? Math.floor((now - due) / 86400000) : 0,
      };
    });
  }

  /** 8. Compliance Report — unchanged logic, single indexed query. */
  async getComplianceReport(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, status, category, riskLevel, search } = queryParams;
    const where = {};
    if (firmId) where.firmId = Number(firmId);
    if (status) where.status = status;
    if (category) where.category = category;
    if (riskLevel) where.priority = riskLevel;
    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);
    if (dateFilter) where.dueDate = dateFilter;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.complianceItem.findMany({ where, orderBy: { dueDate: 'asc' } });
    const now = Date.now();
    return items.map((ci) => ({
      complianceId: ci.id,
      title: ci.title,
      category: ci.category,
      dueDate: ci.dueDate,
      riskLevel: ci.priority || 'MEDIUM',
      status: ci.status !== 'FILED' && new Date(ci.dueDate).getTime() < now ? 'OVERDUE' : ci.status,
      description: ci.period || '',
      penaltyNotes: ci.penaltyDetails || '',
    }));
  }

  /**
   * 9. Custom Report Builder
   * selectedFields.includes() inside every row was O(rows x fields x fields);
   * now a Set is built once -> O(1) checks.
   */
  async generateCustomReport(firmId, config = {}) {
    const { entity = 'tasks', selectedFields = [], dateRange, customStart, customEnd, status } = config;
    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);
    const fields = new Set(selectedFields);
    const want = (f) => fields.size === 0 || fields.has(f);
    const fmt = (d) => (d ? new Date(d).toLocaleDateString() : 'N/A');

    const base = { deletedAt: null };
    if (firmId) base.firmId = Number(firmId);

    if (entity === 'tasks') {
      const where = { ...base };
      if (status) where.status = status;
      if (dateFilter) where.createdAt = dateFilter;
      const tasks = await prisma.task.findMany({
        where,
        select: {
          id: true, title: true, status: true, priority: true, dueDate: true, createdAt: true,
          client: { select: { clientName: true, companyName: true } },
          assignees: { select: { user: { select: { firstName: true, lastName: true } } } },
        },
        take: 100,
        orderBy: { createdAt: 'desc' },
      });
      return tasks.map((t) => {
        const row = {};
        if (want('id')) row.ID = t.id;
        if (want('taskCode')) row['Task Code'] = `TSK-${t.id}`;
        if (want('title')) row.Title = t.title;
        if (want('status')) row.Status = t.status;
        if (want('priority')) row.Priority = t.priority;
        if (want('clientName')) row.Client = t.client?.clientName || t.client?.companyName || 'N/A';
        if (want('assignees')) row.Assignees = t.assignees.map((a) => `${a.user.firstName} ${a.user.lastName}`).join(', ') || 'N/A';
        if (want('dueDate')) row['Due Date'] = fmt(t.dueDate);
        if (want('createdAt')) row['Created At'] = fmt(t.createdAt);
        return row;
      });
    }

    if (entity === 'clients') {
      const where = { ...base };
      if (status) where.status = status;
      if (dateFilter) where.createdAt = dateFilter;
      const clients = await prisma.client.findMany({ where, take: 100, orderBy: { createdAt: 'desc' } });
      return clients.map((c) => {
        const row = {};
        if (want('id')) row.ID = c.id;
        if (want('clientName')) row['Client Name'] = c.clientName;
        if (want('companyName')) row['Company Name'] = c.companyName || 'N/A';
        if (want('email')) row.Email = c.email;
        if (want('phone')) row.Phone = c.phone || 'N/A';
        if (want('clientType')) row.Type = c.clientType;
        if (want('status')) row.Status = c.status;
        if (want('createdAt')) row['Created At'] = fmt(c.createdAt);
        return row;
      });
    }

    if (entity === 'invoices') {
      const where = { ...base };
      if (status) where.status = status;
      if (dateFilter) where.issueDate = dateFilter;
      const invoices = await prisma.invoice.findMany({
        where,
        include: { client: { select: { clientName: true, companyName: true } } },
        take: 100,
        orderBy: { issueDate: 'desc' },
      });
      return invoices.map((inv) => {
        const row = {};
        if (want('id')) row.ID = inv.id;
        if (want('invoiceNumber')) row['Invoice #'] = inv.invoiceNumber || `INV-${inv.id}`;
        if (want('clientName')) row.Client = inv.client?.clientName || inv.client?.companyName || 'N/A';
        if (want('issueDate')) row['Issue Date'] = fmt(inv.issueDate);
        if (want('dueDate')) row['Due Date'] = fmt(inv.dueDate);
        if (want('status')) row.Status = inv.status;
        if (want('totalAmount')) row['Total Amount'] = Number(inv.totalAmount);
        return row;
      });
    }

    if (entity === 'employees') {
      const where = { ...base };
      if (dateFilter) where.createdAt = dateFilter;
      const users = await prisma.user.findMany({
        where,
        select: { id: true, firstName: true, lastName: true, email: true, designation: true, role: true, status: true, createdAt: true },
        take: 100,
        orderBy: { createdAt: 'desc' },
      });
      return users.map((u) => {
        const row = {};
        if (want('id')) row.ID = u.id;
        if (want('name')) row.Name = `${u.firstName} ${u.lastName}`;
        if (want('email')) row.Email = u.email;
        if (want('designation')) row.Designation = u.designation || 'Staff';
        if (want('role')) row.Role = u.role;
        if (want('status')) row.Status = u.status;
        if (want('createdAt')) row['Joined At'] = fmt(u.createdAt);
        return row;
      });
    }

    return [];
  }
}

module.exports = new ReportRepository();
