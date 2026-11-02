const prisma = require('../../config/db');
const { BadRequestError } = require('../../utils/errors');

const DAY_MS = 24 * 60 * 60 * 1000;
const OPEN_TASK = ['PENDING', 'IN_PROGRESS', 'UNDER_REVIEW'];
const OPEN_COMPLIANCE = ['UPCOMING', 'IN_PROGRESS', 'OVERDUE', 'EXTENDED'];
const OPEN_LEAD = ['NEW_LEAD', 'DISCUSSION', 'PROPOSAL_SENT'];
const clientSelect = { select: { id: true, clientName: true, companyName: true } };
const nameOfClient = (c) => c?.companyName || c?.clientName || 'Client';
const fullName = (u) => [u?.firstName, u?.lastName].filter(Boolean).join(' ');

const startOfDay = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
/** Leave and attendance dates are stored as the local date at UTC midnight (see attendance.repository). */
const dateOnly = (d = new Date()) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

const STATUS_WORDS = { PENDING: 'pending', IN_PROGRESS: 'in progress', UNDER_REVIEW: 'review', COMPLETED: 'completed', CANCELLED: 'cancelled' };

/** One readable line per task history entry. */
const taskActivity = (h) => {
  const title = h.task?.title || 'a task';
  switch (h.action) {
    case 'TASK_CREATED':
      return `created ${title}`;
    case 'STATUS_UPDATED': {
      const to = /to '(\w+)'/.exec(h.details)?.[1];
      return to ? `moved ${title} to ${STATUS_WORDS[to] || to.toLowerCase()}` : `updated ${title}`;
    }
    case 'COMMENT_ADDED':
      return `commented on ${title}`;
    case 'DOCUMENT_ATTACHED':
      return `attached a file to ${title}`;
    case 'CLIENT_REQUEST_APPROVED':
      return `approved the request ${title}`;
    default:
      return `${h.details.replace(/\.$/, '')} (${title})`;
  }
};

/**
 * Everything below the firm admin home's first screen, in one request:
 * ready to bill, team workload, unpaid invoices by age, the compliance calendar, today's agenda,
 * the monthly billing target, documents waiting on clients, the lead pipeline and recent activity.
 * All queries are independent and run at once.
 */
const getFirmWorkspace = async (firmId) => {
  const fId = parseInt(firmId, 10);
  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = new Date(today.getTime() + DAY_MS);
  const in30 = new Date(today.getTime() + 31 * DAY_MS);
  const in7 = new Date(now.getTime() + 7 * DAY_MS);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayDate = dateOnly(now);

  const [
    readyRows,
    workloadRows,
    staff,
    agingRows,
    oldestOverdue,
    calendarItems,
    meetingsToday,
    onLeave,
    tasksDueToday,
    firm,
    billedThisMonth,
    docRequests,
    docRequestCount,
    leadStages,
    leadsClosedThisMonth,
    history,
    payments,
    uploads,
    clientLogs,
  ] = await Promise.all([
    // Ready to bill: completed tasks per client since that client's last invoice (last 180 days).
    prisma.$queryRaw`
      WITH last_invoice AS (
        SELECT "clientId", MAX("issueDate") AS last FROM "invoices"
        WHERE "firmId" = ${fId} AND "deletedAt" IS NULL GROUP BY "clientId"
      )
      SELECT t."clientId", COUNT(*)::int AS "tasks", MAX(t."updatedAt") AS "lastDone", MAX(li.last) AS "lastInvoice",
             COUNT(*) OVER ()::int AS "clientCount", (SUM(COUNT(*)) OVER ())::int AS "taskCount"
      FROM "tasks" t
      LEFT JOIN last_invoice li ON li."clientId" = t."clientId"
      WHERE t."firmId" = ${fId} AND t."deletedAt" IS NULL AND t."status" = 'COMPLETED' AND t."clientId" IS NOT NULL
        AND t."updatedAt" > now() - interval '180 days'
        AND t."updatedAt" > COALESCE(li.last, timestamp 'epoch')
      GROUP BY t."clientId"
      ORDER BY COUNT(*) DESC, MAX(t."updatedAt") DESC
      LIMIT 6
    `,
    // Workload: open tasks per person, counting the main assignee and everyone in task_assignees once.
    prisma.$queryRaw`
      SELECT p."userId",
             COUNT(*)::int AS "open",
             COUNT(*) FILTER (WHERE t."dueDate" < ${now})::int AS "overdue",
             COUNT(*) FILTER (WHERE t."dueDate" >= ${now} AND t."dueDate" < ${in7})::int AS "dueWeek"
      FROM "tasks" t
      JOIN LATERAL (
        SELECT t."userId" WHERE t."userId" IS NOT NULL
        UNION SELECT ta."userId" FROM "task_assignees" ta WHERE ta."taskId" = t."id"
      ) p("userId") ON true
      WHERE t."firmId" = ${fId} AND t."deletedAt" IS NULL AND t."status" IN ('PENDING', 'IN_PROGRESS', 'UNDER_REVIEW')
      GROUP BY p."userId"
    `,
    prisma.user.findMany({
      where: { firmId: fId, deletedAt: null, status: 'ACTIVE', role: { in: ['USER', 'EMPLOYEE'] } },
      select: { id: true, firstName: true, lastName: true, designation: true },
      orderBy: { firstName: 'asc' },
      take: 60,
    }),
    // Unpaid balance by how long past due.
    prisma.$queryRaw`
      SELECT
        CASE
          WHEN "dueDate" >= ${today} THEN 'current'
          WHEN "dueDate" >= ${today}::timestamp - interval '30 days' THEN 'd30'
          WHEN "dueDate" >= ${today}::timestamp - interval '60 days' THEN 'd60'
          WHEN "dueDate" >= ${today}::timestamp - interval '90 days' THEN 'd90'
          ELSE 'd90plus'
        END AS "bucket",
        COALESCE(SUM("balanceAmount"), 0) AS "amount",
        COUNT(*)::int AS "count"
      FROM "invoices"
      WHERE "firmId" = ${fId} AND "deletedAt" IS NULL AND "balanceAmount" > 0 AND "status" NOT IN ('PAID', 'CANCELLED')
      GROUP BY 1
    `,
    prisma.invoice.findMany({
      where: { firmId: fId, deletedAt: null, balanceAmount: { gt: 0 }, status: { notIn: ['PAID', 'CANCELLED'] }, dueDate: { lt: today } },
      orderBy: { dueDate: 'asc' },
      take: 5,
      select: { id: true, invoiceNumber: true, dueDate: true, balanceAmount: true, client: { select: { ...clientSelect.select, email: true } } },
    }),
    prisma.complianceItem.findMany({
      where: { firmId: fId, status: { in: OPEN_COMPLIANCE }, dueDate: { gte: today, lt: in30 } },
      orderBy: { dueDate: 'asc' },
      take: 300,
      select: { id: true, title: true, category: true, status: true, dueDate: true, client: clientSelect },
    }),
    prisma.meeting.findMany({
      where: { firmId: fId, status: { notIn: ['CANCELLED', 'DRAFT'] }, startTime: { gte: today, lt: tomorrow } },
      orderBy: { startTime: 'asc' },
      take: 10,
      select: { id: true, title: true, startTime: true, endTime: true, meetingMode: true, location: true, status: true },
    }),
    prisma.leaveRequest.findMany({
      where: { firmId: fId, status: 'APPROVED', startDate: { lte: todayDate }, endDate: { gte: todayDate } },
      take: 10,
      select: { id: true, leaveType: true, endDate: true, user: { select: { id: true, firstName: true, lastName: true } } },
    }),
    prisma.task.findMany({
      where: { firmId: fId, deletedAt: null, status: { in: OPEN_TASK }, dueDate: { gte: today, lt: tomorrow } },
      orderBy: { dueDate: 'asc' },
      take: 10,
      select: { id: true, title: true, dueDate: true, client: clientSelect, user: { select: { firstName: true, lastName: true } } },
    }),
    prisma.firm.findUnique({ where: { id: fId }, select: { monthlyBillingTarget: true } }),
    prisma.invoice.aggregate({
      where: { firmId: fId, deletedAt: null, status: { not: 'CANCELLED' }, issueDate: { gte: monthStart } },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
    prisma.documentRequest.findMany({
      where: { firmId: fId, status: 'PENDING' },
      orderBy: [{ dueDate: { sort: 'asc', nulls: 'last' } }, { createdAt: 'asc' }],
      take: 6,
      select: { id: true, title: true, dueDate: true, createdAt: true, lastRemindedAt: true, client: clientSelect },
    }),
    prisma.documentRequest.count({ where: { firmId: fId, status: 'PENDING' } }),
    prisma.lead.groupBy({ by: ['stage'], where: { firmId: fId, deletedAt: null }, _count: { _all: true }, _sum: { estimatedValue: true } }),
    prisma.lead.groupBy({ by: ['stage'], where: { firmId: fId, deletedAt: null, stage: { in: ['WON', 'LOST'] }, updatedAt: { gte: monthStart } }, _count: { _all: true } }),
    prisma.taskHistory.findMany({
      where: { task: { firmId: fId } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, action: true, details: true, performedName: true, createdAt: true, task: { select: { title: true } } },
    }),
    prisma.paymentRecord.findMany({
      where: { invoice: { firmId: fId, deletedAt: null } },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, amount: true, createdAt: true, invoice: { select: { invoiceNumber: true, client: clientSelect } } },
    }),
    prisma.documentVault.findMany({
      where: { firmId: fId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, title: true, createdAt: true, uploader: { select: { firstName: true, lastName: true } }, uploaderClient: clientSelect },
    }),
    prisma.clientActivityLog.findMany({
      where: { client: { firmId: fId } },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, description: true, performedName: true, createdAt: true, client: clientSelect },
    }),
  ]);

  // Names and usual monthly fees for the ready-to-bill clients (one query each, batched with in: [...]).
  const readyIds = readyRows.map((r) => r.clientId);
  const [readyClients, fees] = readyIds.length
    ? await Promise.all([
        prisma.client.findMany({ where: { id: { in: readyIds } }, select: clientSelect.select }),
        prisma.clientServiceItem.groupBy({ by: ['clientId'], where: { clientId: { in: readyIds }, status: 'ACTIVE' }, _sum: { feeAmount: true } }),
      ])
    : [[], []];
  const clientById = Object.fromEntries(readyClients.map((c) => [c.id, c]));
  const feeById = Object.fromEntries(fees.map((f) => [f.clientId, Number(f._sum.feeAmount) || 0]));

  const loadById = Object.fromEntries(workloadRows.map((w) => [w.userId, w]));
  const agingBy = Object.fromEntries(agingRows.map((a) => [a.bucket, { amount: Number(a.amount), count: a.count }]));
  const stageBy = Object.fromEntries(leadStages.map((s) => [s.stage, { count: s._count._all, value: Number(s._sum.estimatedValue) || 0 }]));
  const closedBy = Object.fromEntries(leadsClosedThisMonth.map((s) => [s.stage, s._count._all]));
  const won = stageBy.WON?.count || 0;
  const lost = stageBy.LOST?.count || 0;

  const activity = [
    ...history.map((h) => ({ id: `t${h.id}`, kind: 'task', actor: h.performedName, text: taskActivity(h), at: h.createdAt })),
    ...payments.map((p) => ({
      id: `p${p.id}`,
      kind: 'payment',
      actor: nameOfClient(p.invoice?.client),
      text: `paid ₹${Math.round(p.amount).toLocaleString('en-IN')} on ${p.invoice?.invoiceNumber || 'an invoice'}`,
      at: p.createdAt,
    })),
    ...uploads.map((d) => ({
      id: `d${d.id}`,
      kind: 'document',
      actor: d.uploaderClient ? nameOfClient(d.uploaderClient) : fullName(d.uploader) || 'Someone',
      text: `uploaded ${d.title}`,
      at: d.createdAt,
    })),
    ...clientLogs.map((l) => ({ id: `c${l.id}`, kind: 'client', actor: l.performedName || 'Someone', text: `${l.description.replace(/\.$/, '')} · ${nameOfClient(l.client)}`, at: l.createdAt })),
  ]
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 10);

  return {
    readyToBill: {
      clientCount: readyRows[0]?.clientCount || 0,
      taskCount: readyRows[0]?.taskCount || 0,
      clients: readyRows.map((r) => ({
        clientId: r.clientId,
        name: nameOfClient(clientById[r.clientId]),
        tasks: r.tasks,
        lastDone: r.lastDone,
        lastInvoice: r.lastInvoice,
        monthlyFee: feeById[r.clientId] || 0,
      })),
    },
    workload: staff
      .map((u) => ({ userId: u.id, name: fullName(u), designation: u.designation, open: 0, overdue: 0, dueWeek: 0, ...(loadById[u.id] || {}) }))
      .map(({ userId, name, designation, open, overdue, dueWeek }) => ({ userId, name, designation, open, overdue, dueWeek }))
      .sort((a, b) => b.open - a.open || b.overdue - a.overdue),
    aging: {
      buckets: [
        ['current', 'Not yet due'],
        ['d30', '1–30 days'],
        ['d60', '31–60 days'],
        ['d90', '61–90 days'],
        ['d90plus', '90+ days'],
      ].map(([key, label]) => ({ key, label, amount: agingBy[key]?.amount || 0, count: agingBy[key]?.count || 0 })),
      oldest: oldestOverdue.map((i) => ({
        invoiceId: i.id,
        invoiceNumber: i.invoiceNumber,
        clientName: nameOfClient(i.client),
        hasEmail: Boolean(i.client?.email),
        balance: Number(i.balanceAmount),
        daysOverdue: Math.floor((today - startOfDay(new Date(i.dueDate))) / DAY_MS),
      })),
    },
    calendar: calendarItems.map((c) => ({ id: c.id, title: c.title, category: c.category, status: c.status, dueDate: c.dueDate, client: c.client ? nameOfClient(c.client) : null })),
    agenda: {
      meetings: meetingsToday,
      onLeave: onLeave.map((l) => ({ id: l.id, name: fullName(l.user), leaveType: l.leaveType, endDate: l.endDate })),
      dueToday: [
        ...tasksDueToday.map((t) => ({ key: `t${t.id}`, kind: 'task', title: t.title, who: [t.client && nameOfClient(t.client), t.user && fullName(t.user)].filter(Boolean).join(' · ') })),
        ...calendarItems
          .filter((c) => new Date(c.dueDate) < tomorrow)
          .map((c) => ({ key: `c${c.id}`, kind: 'filing', title: c.title, who: c.client ? nameOfClient(c.client) : 'All clients' })),
      ],
    },
    target: {
      monthlyTarget: firm?.monthlyBillingTarget ?? null,
      billed: Number(billedThisMonth._sum.totalAmount) || 0,
      invoices: billedThisMonth._count._all,
      month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      daysLeft: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate(),
    },
    documents: {
      pending: docRequestCount,
      items: docRequests.map((d) => ({ id: d.id, title: d.title, client: nameOfClient(d.client), clientId: d.client?.id, dueDate: d.dueDate, requestedAt: d.createdAt, lastRemindedAt: d.lastRemindedAt })),
    },
    leads: {
      stages: OPEN_LEAD.concat(['WON']).map((stage) => ({ stage, count: stageBy[stage]?.count || 0, value: stageBy[stage]?.value || 0 })),
      pipelineValue: OPEN_LEAD.reduce((s, k) => s + (stageBy[k]?.value || 0), 0),
      wonThisMonth: closedBy.WON || 0,
      lostThisMonth: closedBy.LOST || 0,
      conversion: won + lost ? Math.round((won / (won + lost)) * 100) : null,
    },
    activity,
  };
};

/** Sets (or clears, with null) the firm's monthly billing goal. */
const setBillingTarget = async (firmId, target) => {
  const value = target === null || target === '' ? null : Number(target);
  if (value !== null && (!Number.isFinite(value) || value < 0 || value > 1e11)) {
    throw new BadRequestError('Enter a target amount in rupees, or leave it empty to clear it.');
  }
  const firm = await prisma.firm.update({ where: { id: parseInt(firmId, 10) }, data: { monthlyBillingTarget: value }, select: { monthlyBillingTarget: true } });
  return { monthlyTarget: firm.monthlyBillingTarget };
};

module.exports = { getFirmWorkspace, setBillingTarget };
