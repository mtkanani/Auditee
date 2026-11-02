const prisma = require('../../config/db');
const notificationService = require('./notification.service');

/**
 * Who hears about what. Each function is called from the service that made the change, runs after
 * the response (notificationService.later) and never throws into it. The person who made a change
 * is never notified about it.
 */

const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in progress',
  UNDER_REVIEW: 'under review',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REQUESTED: 'requested',
};
const LEAVE = { CASUAL_LEAVE: 'casual leave', SICK_LEAVE: 'sick leave', EARNED_LEAVE: 'earned leave', UNPAID_LEAVE: 'unpaid leave' };
const day = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const money = (n) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;
const clientName = (c) => c?.companyName || c?.clientName || 'a client';
const fullName = (u) => [u?.firstName, u?.lastName].filter(Boolean).join(' ') || 'Someone';

/** Staff link: the firm admin and employees open different pages for the same thing. */
const staffLink = (userId, adminId, adminPath, userPath) => (userId === adminId ? adminPath : userPath);

/** Everyone working on a task: its assignees and its main user, plus the firm admin. */
const taskPeople = async (taskId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      firmId: true,
      title: true,
      userId: true,
      clientId: true,
      client: { select: { clientName: true, companyName: true } },
      assignees: { select: { userId: true } },
    },
  });
  if (!task) return null;
  const adminId = await notificationService.firmAdminId(task.firmId);
  const staff = new Set([task.userId, adminId, ...task.assignees.map((a) => a.userId)].filter(Boolean));
  return { task, adminId, staff: [...staff] };
};

const toStaff = (ids, actorId, adminId, entry) =>
  ids
    .filter((id) => id !== actorId)
    .map((userId) => ({
      ...entry,
      userId,
      link: staffLink(userId, adminId, entry.adminLink || '/firm-admin/tasks', entry.userLink || '/user/tasks'),
    }));

const notify = {
  /** New task for the people it was assigned to. */
  taskAssigned(task, userIds, actorId) {
    notificationService.later(async () => {
      const adminId = await notificationService.firmAdminId(task.firmId);
      const due = task.dueDate ? ` · due ${day(task.dueDate)}` : '';
      return toStaff(userIds, actorId, adminId, { firmId: task.firmId, type: 'TASK_ASSIGNED', title: `New task: ${task.title}`, body: `Assigned to you${due}` });
    });
  },

  /** Status change: everyone on the task, and the client once the work is done. */
  taskStatus(taskId, status, actor) {
    notificationService.later(async () => {
      const people = await taskPeople(taskId);
      if (!people) return [];
      const { task, adminId, staff } = people;
      const entries = toStaff(staff, actor.isClient ? null : actor.id, adminId, {
        firmId: task.firmId,
        type: 'TASK_STATUS',
        title: `${task.title} is ${TASK_STATUS[status] || status.toLowerCase()}`,
        body: `${fullName(actor)} changed the status`,
      });
      if (status === 'COMPLETED' && task.clientId) {
        entries.push({ firmId: task.firmId, clientId: task.clientId, type: 'TASK_STATUS', title: `Work completed: ${task.title}`, body: 'Your CA firm has finished this work.', link: '/client/tasks' });
      }
      return entries;
    });
  },

  /** A comment: everyone on the task except the person who wrote it. */
  taskComment(taskId, actor, text) {
    notificationService.later(async () => {
      const people = await taskPeople(taskId);
      if (!people) return [];
      const { task, adminId, staff } = people;
      return toStaff(staff, actor.isClient ? null : actor.id, adminId, {
        firmId: task.firmId,
        type: 'TASK_COMMENT',
        title: `${fullName(actor.isClient ? { firstName: actor.clientName } : actor)} commented on ${task.title}`,
        body: text,
      });
    });
  },

  /** A client asked for new work: the firm admin and the client's assigned employee. */
  workRequested(task) {
    notificationService.later(async () => {
      const adminId = await notificationService.firmAdminId(task.firmId);
      return toStaff([adminId, task.userId].filter(Boolean), null, adminId, {
        firmId: task.firmId,
        type: 'WORK_REQUESTED',
        title: `Work request from ${clientName(task.client)}`,
        body: task.title,
      });
    });
  },

  /** The firm approved or declined a client's work request. */
  workRequestDecided(task, approved) {
    if (!task.clientId) return;
    notificationService.later(() => [
      {
        firmId: task.firmId,
        clientId: task.clientId,
        type: 'WORK_REQUEST_DECIDED',
        title: approved ? `Request accepted: ${task.title}` : `Request declined: ${task.title}`,
        body: approved ? 'Your CA firm has started on it.' : 'Contact your CA firm for details.',
        link: '/client/work-requests',
      },
    ]);
  },

  leaveApplied(request, user) {
    notificationService.later(async () => {
      const adminId = await notificationService.firmAdminId(request.firmId);
      if (!adminId || adminId === request.userId) return [];
      return [
        {
          firmId: request.firmId,
          userId: adminId,
          type: 'LEAVE_REQUESTED',
          title: `${fullName(user)} asked for ${LEAVE[request.leaveType] || 'leave'}`,
          body: `${day(request.startDate)} to ${day(request.endDate)} · ${request.reason}`,
          link: '/firm-admin/leave-management',
        },
      ];
    });
  },

  leaveReviewed(request) {
    const approved = request.status === 'APPROVED';
    notificationService.later(() => [
      {
        firmId: request.firmId,
        userId: request.userId,
        type: 'LEAVE_REVIEWED',
        title: `Your leave was ${approved ? 'approved' : 'rejected'}`,
        body: `${day(request.startDate)} to ${day(request.endDate)}${request.adminRemarks ? ` · ${request.adminRemarks}` : ''}`,
        link: '/user/leaves',
      },
    ]);
  },

  /** A client uploaded a file: the firm admin. */
  clientDocument(doc, client) {
    notificationService.later(async () => {
      const adminId = await notificationService.firmAdminId(doc.firmId);
      return [{ firmId: doc.firmId, userId: adminId, type: 'CLIENT_DOCUMENT', title: `${client?.clientName || 'A client'} uploaded ${doc.title}`, body: doc.fileName, link: '/firm-admin/document-vault' }];
    });
  },

  invoiceCreated(invoice) {
    notificationService.later(() => [
      {
        firmId: invoice.firmId,
        clientId: invoice.clientId,
        type: 'INVOICE',
        title: `New invoice ${invoice.invoiceNumber}`,
        body: `${money(invoice.totalAmount)} due ${day(invoice.dueDate)}`,
        link: '/client/billing',
      },
    ]);
  },

  /** A client paid online: the firm admin. */
  paymentByClient(invoice, amount) {
    notificationService.later(async () => {
      const adminId = await notificationService.firmAdminId(invoice.firmId);
      return [{ firmId: invoice.firmId, userId: adminId, type: 'PAYMENT', title: `${clientName(invoice.client)} paid ${money(amount)}`, body: `Invoice ${invoice.invoiceNumber}`, link: '/firm-admin/billing' }];
    });
  },

  /** Invited to a meeting: staff and clients on the participant list. */
  meetingInvite(meeting, actorId) {
    notificationService.later(async () => {
      const participants = await prisma.meetingParticipant.findMany({ where: { meetingId: meeting.id }, select: { userId: true, clientId: true } });
      const adminId = await notificationService.firmAdminId(meeting.firmId);
      const when = new Date(meeting.startTime).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
      const base = { firmId: meeting.firmId, type: 'MEETING', title: `Meeting: ${meeting.title}`, body: when };
      return participants
        .filter((p) => (p.userId && p.userId !== actorId) || p.clientId)
        .map((p) =>
          p.userId
            ? { ...base, userId: p.userId, link: staffLink(p.userId, adminId, '/firm-admin/meetings', '/user/meetings') }
            : { ...base, clientId: p.clientId, link: '/client/meetings' }
        );
    });
  },
};

module.exports = notify;
