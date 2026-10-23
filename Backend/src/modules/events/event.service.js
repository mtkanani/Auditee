// src/modules/events/event.service.js
const prisma = require('../../config/db');
const { ForbiddenError, NotFoundError } = require('../../utils/errors');

/**
 * Aggregate various entities into a unified Event shape.
 * Types: TASK, COMPLIANCE, MEETING, LEAVE, DEADLINE (custom).
 */
class EventService {
  /**
   * Get events in a date range.
   * @param {{start: string, end: string}} range - ISO date strings.
   * @param {{id: number, role: string, firmId: number}} user - Authenticated user.
   * @returns {Promise<Array>} List of events.
   */
  async getEvents(range, user) {
    const { start, end } = range;
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Helper to limit visibility based on role
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'FIRM_ADMIN'].includes(user.role);
    const userFilter = isAdmin ? {} : { userId: user.id };

    // Run all 4 queries concurrently in parallel
    const [taskRows, compRows, meetingRows, leaveRows] = await Promise.all([
      // 1. TASKS (using dueDate as event)
      prisma.task.findMany({
        where: {
          firmId: user.firmId,
          deletedAt: null,
          dueDate: { gte: startDate, lte: endDate },
          ...userFilter,
        },
        select: { id: true, title: true, dueDate: true },
      }),

      // 2. COMPLIANCE items (dueDate) - ComplianceItem has no userId column, filtered by firmId
      prisma.complianceItem.findMany({
        where: {
          firmId: user.firmId,
          dueDate: { gte: startDate, lte: endDate },
        },
        select: { id: true, title: true, dueDate: true, period: true },
      }),

      // 3. MEETINGS from lead meeting notes - safely scoped to user's firm
      prisma.leadMeetingNote.findMany({
        where: {
          meetingDate: { gte: startDate, lte: endDate },
          lead: { firmId: user.firmId },
          ...(isAdmin ? {} : { loggedBy: user.id }),
        },
        select: { id: true, meetingTitle: true, meetingNotes: true, meetingDate: true },
      }),

      // 4. LEAVE requests
      prisma.leaveRequest.findMany({
        where: {
          firmId: user.firmId,
          startDate: { lte: endDate },
          endDate: { gte: startDate },
          ...(isAdmin ? {} : { userId: user.id }),
        },
        select: { id: true, leaveType: true, startDate: true, endDate: true, reason: true },
      }),
    ]);

    const taskEvents = taskRows.map((t) => ({
      id: t.id,
      type: 'TASK',
      title: t.title,
      start: t.dueDate,
      end: t.dueDate,
      metadata: {},
    }));

    const compEvents = compRows.map((c) => ({
      id: c.id,
      type: 'COMPLIANCE',
      title: c.title,
      start: c.dueDate,
      end: c.dueDate,
      metadata: { period: c.period },
    }));

    const meetingEvents = meetingRows.map((m) => ({
      id: m.id,
      type: 'MEETING',
      title: m.meetingTitle,
      start: m.meetingDate,
      end: m.meetingDate,
      metadata: { notes: m.meetingNotes },
    }));

    const leaveEvents = leaveRows.map((l) => ({
      id: l.id,
      type: 'LEAVE',
      title: `Leave – ${l.leaveType}`,
      start: l.startDate,
      end: l.endDate,
      metadata: { reason: l.reason },
    }));

    // Combine all
    return [...taskEvents, ...compEvents, ...meetingEvents, ...leaveEvents];
  }

  // Admin‑only creation of a custom event (optional)
  async createCustomEvent(payload, user) {
    if (!['ADMIN', 'SUPER_ADMIN', 'FIRM_ADMIN'].includes(user.role)) {
      throw new ForbiddenError('Only admins can create custom events');
    }
    const { type, title, start, end, metadata } = payload;
    const event = await prisma.event.create({
      data: {
        type,
        title,
        start: new Date(start),
        end: end ? new Date(end) : null,
        userId: payload.userId || null,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      },
    });
    return event;
  }
}

module.exports = new EventService();
