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
    // Everyone who can check in: the employees plus the firm admin (whose own check-ins count too).
    attendance: { checkedIn, team: totalUsers + 1 },
    recentUsers,
    generatedAt: now.toISOString(),
  };
};

const isoDay = (d) => d.toISOString().slice(0, 10);

/**
 * History for the home page charts: billed vs collected per month (last 6 or 12), people checked in per
 * day (last 14), open compliance by status, and the five clients owing the most. Kept separate from
 * getFirmHome so the home's numbers never wait for these.
 */
const getFirmInsights = async (firmId, { months = 6 } = {}) => {
  const fId = parseInt(firmId, 10);
  const span = months === 12 ? 12 : 6;
  const today = isoDay(todayDateOnly());

  const [revenue, attendance, complianceGroups, owing, team] = await Promise.all([
    prisma.$queryRaw`
      WITH months AS (
        SELECT generate_series(date_trunc('month', now()) - (${span - 1}::int * interval '1 month'), date_trunc('month', now()), interval '1 month') AS m
      )
      SELECT
        to_char(m, 'YYYY-MM') AS "month",
        COALESCE((
          SELECT SUM(i."totalAmount") FROM "invoices" i
          WHERE i."firmId" = ${fId} AND i."deletedAt" IS NULL AND i."issueDate" >= m AND i."issueDate" < m + interval '1 month'
        ), 0) AS "billed",
        COALESCE((
          SELECT SUM(p."amount") FROM "payment_records" p
          JOIN "invoices" i ON i."id" = p."invoiceId"
          WHERE i."firmId" = ${fId} AND i."deletedAt" IS NULL AND p."paymentDate" >= m AND p."paymentDate" < m + interval '1 month'
        ), 0) AS "collected"
      FROM months
      ORDER BY m
    `,
    // Attendance days are stored as the local date at UTC midnight (see attendance.repository).
    prisma.$queryRaw`
      SELECT to_char(d, 'YYYY-MM-DD') AS "day", COUNT(a."id") AS "checkedIn"
      FROM generate_series(${today}::timestamp - interval '13 days', ${today}::timestamp, interval '1 day') AS d
      LEFT JOIN "attendance_records" a ON a."firmId" = ${fId} AND a."date" = d
      GROUP BY d
      ORDER BY d
    `,
    prisma.complianceItem.groupBy({ by: ['status'], where: { firmId: fId }, _count: { _all: true } }),
    prisma.invoice.groupBy({
      by: ['clientId'],
      where: { firmId: fId, deletedAt: null, balanceAmount: { gt: 0 } },
      _sum: { balanceAmount: true },
      _count: { _all: true },
      orderBy: { _sum: { balanceAmount: 'desc' } },
      take: 5,
    }),
    prisma.user.count({ where: { firmId: fId, deletedAt: null, role: 'USER' } }),
  ]);

  const clients = owing.length
    ? await prisma.client.findMany({
        where: { id: { in: owing.map((o) => o.clientId) } },
        select: { id: true, clientName: true, companyName: true },
      })
    : [];
  const nameOf = Object.fromEntries(clients.map((c) => [c.id, c.companyName || c.clientName]));
  const byStatus = Object.fromEntries(complianceGroups.map((g) => [g.status, g._count._all]));

  return {
    revenue: revenue.map((r) => ({ month: r.month, billed: Number(r.billed), collected: Number(r.collected) })),
    // Employees plus the firm admin, matching who is counted in attendance.
    attendance: { team: team + 1, days: attendance.map((a) => ({ day: a.day, checkedIn: Number(a.checkedIn) })) },
    compliance: {
      overdue: byStatus.OVERDUE || 0,
      upcoming: (byStatus.UPCOMING || 0) + (byStatus.EXTENDED || 0),
      inProgress: byStatus.IN_PROGRESS || 0,
      filed: byStatus.FILED || 0,
    },
    topOutstanding: owing.map((o) => ({
      clientId: o.clientId,
      name: nameOf[o.clientId] || 'Client',
      balance: Number(o._sum.balanceAmount) || 0,
      invoices: o._count._all,
    })),
  };
};

module.exports = { getFirmHome, getFirmInsights };
