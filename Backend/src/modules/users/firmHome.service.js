const prisma = require('../../config/db');

const DAY_MS = 24 * 60 * 60 * 1000;
const OPEN_COMPLIANCE = ['UPCOMING', 'IN_PROGRESS', 'OVERDUE', 'EXTENDED'];
const clientSelect = { select: { id: true, clientName: true, companyName: true } };

/** Attendance rows are keyed by the local calendar day stored as UTC midnight (see attendance.repository). */
const todayDateOnly = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

/**
 * Everything the firm admin home shows, in one round trip. Every query is independent and indexed
 * (firmId + status / dueDate / date), so they all run at once with Promise.all.
 */
const getFirmHome = async (firmId) => {
  const fId = parseInt(firmId, 10);
  const now = new Date();
  const inAWeek = new Date(now.getTime() + 7 * DAY_MS);

  const [
    totalClients,
    totalUsers,
    taskGroups,
    pendingCompliance,
    compliance,
    dueTasks,
    [invoiceTotals],
    pendingLeaveCount,
    pendingLeave,
    checkedIn,
    recentUsers,
  ] = await Promise.all([
    prisma.client.count({ where: { firmId: fId, deletedAt: null } }),
    prisma.user.count({ where: { firmId: fId, deletedAt: null, role: 'USER' } }),
    prisma.task.groupBy({ by: ['status'], where: { firmId: fId, deletedAt: null }, _count: { _all: true } }),
    prisma.complianceItem.count({ where: { firmId: fId, status: { in: OPEN_COMPLIANCE } } }),
    // Open filings that are overdue or due within 7 days, nearest first.
    prisma.complianceItem.findMany({
      where: { firmId: fId, status: { in: OPEN_COMPLIANCE }, dueDate: { lte: inAWeek } },
      orderBy: { dueDate: 'asc' },
      take: 8,
      select: { id: true, title: true, dueDate: true, status: true, client: clientSelect },
    }),
    // Open tasks that are overdue or due within 7 days, nearest first.
    prisma.task.findMany({
      where: { firmId: fId, deletedAt: null, status: { notIn: ['COMPLETED', 'CANCELLED'] }, dueDate: { lte: inAWeek } },
      orderBy: { dueDate: 'asc' },
      take: 8,
      select: {
        id: true,
        title: true,
        dueDate: true,
        status: true,
        priority: true,
        client: clientSelect,
        user: { select: { firstName: true, lastName: true } },
      },
    }),
    // Totals and the overdue count in one pass; the invoices (firmId, deletedAt, status, dueDate,
    // amounts) index makes this an index-only scan.
    prisma.$queryRaw`
      SELECT
        COALESCE(SUM("totalAmount"), 0)   AS "totalAmount",
        COALESCE(SUM("paidAmount"), 0)    AS "paidAmount",
        COALESCE(SUM("balanceAmount"), 0) AS "balanceAmount",
        COUNT(*) FILTER (WHERE "status" = 'OVERDUE' OR ("dueDate" < ${now} AND "status" <> 'PAID')) AS "overdueCount"
      FROM "invoices"
      WHERE "firmId" = ${fId} AND "deletedAt" IS NULL
    `,
    prisma.leaveRequest.count({ where: { firmId: fId, status: 'PENDING' } }),
    prisma.leaveRequest.findMany({
      where: { firmId: fId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: { user: { select: { id: true, firstName: true, lastName: true, designation: true } } },
    }),
    prisma.attendanceRecord.count({ where: { firmId: fId, date: todayDateOnly() } }),
    prisma.user.findMany({
      where: { firmId: fId, deletedAt: null, role: 'USER' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: { id: true, firstName: true, lastName: true, designation: true, createdAt: true },
    }),
  ]);

  const byStatus = Object.fromEntries(taskGroups.map((g) => [g.status, g._count._all]));

  return {
    metrics: {
      totalClients,
      totalUsers,
      pendingTasks: byStatus.PENDING || 0,
      inProgressTasks: byStatus.IN_PROGRESS || 0,
      completedTasks: byStatus.COMPLETED || 0,
      underReviewTasks: byStatus.UNDER_REVIEW || 0,
      pendingCompliance,
    },
    compliance,
    dueTasks,
    invoices: {
      totalAmount: Number(invoiceTotals.totalAmount),
      paidAmount: Number(invoiceTotals.paidAmount),
      balanceAmount: Number(invoiceTotals.balanceAmount),
      overdueCount: Number(invoiceTotals.overdueCount),
    },
    leave: { pendingCount: pendingLeaveCount, pending: pendingLeave },
    attendance: { checkedIn, team: totalUsers },
    recentUsers,
    generatedAt: now.toISOString(),
  };
};

module.exports = { getFirmHome };
