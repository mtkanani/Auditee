const prisma = require('../../config/db');
const { emitToUsers, emitToClients } = require('../../realtime/socket');

const FIELDS = { id: true, type: true, title: true, body: true, link: true, readAt: true, createdAt: true };
const MAX_PAGE = 50;

// Firm admin ids change almost never; remember them for a few minutes to save a query per event.
const ADMIN_TTL_MS = 5 * 60 * 1000;
const adminCache = new Map(); // firmId -> { id, until }

const ownerWhere = (user) => (user.isClient ? { clientId: user.id } : { userId: user.id });
const pick = (n) => ({ id: n.id, type: n.type, title: n.title, body: n.body, link: n.link, readAt: n.readAt, createdAt: n.createdAt });

class NotificationService {
  /**
   * Saves notifications and pushes each one live to its recipient.
   * entries: [{ firmId, userId | clientId, type, title, body?, link? }]
   */
  async notify(entries) {
    const rows = entries
      .filter((e) => e && (e.userId || e.clientId))
      .map((e) => ({
        firmId: e.firmId ?? null,
        userId: e.userId ?? null,
        clientId: e.userId ? null : e.clientId ?? null,
        type: e.type,
        title: String(e.title).slice(0, 200),
        body: e.body ? String(e.body).slice(0, 500) : null,
        link: e.link ?? null,
      }));
    if (!rows.length) return [];

    const created = await prisma.notification.createManyAndReturn({ data: rows, select: { ...FIELDS, userId: true, clientId: true } });
    for (const n of created) {
      if (n.userId) emitToUsers([n.userId], 'notification:new', pick(n));
      else emitToClients([n.clientId], 'notification:new', pick(n));
    }
    return created;
  }

  /**
   * Fire and forget, for use inside other services: builds the recipients after the response is on
   * its way, and a failure is logged but never fails the action that caused it.
   */
  later(build) {
    setImmediate(async () => {
      try {
        const entries = await build();
        if (entries?.length) await this.notify(entries);
      } catch (err) {
        console.error('Notification failed:', err.message);
      }
    });
  }

  async firmAdminId(firmId) {
    const hit = adminCache.get(firmId);
    if (hit && hit.until > Date.now()) return hit.id;
    const firm = await prisma.firm.findUnique({ where: { id: firmId }, select: { firmAdminId: true } });
    const id = firm?.firmAdminId ?? null;
    adminCache.set(firmId, { id, until: Date.now() + ADMIN_TTL_MS });
    return id;
  }

  async list(user, { limit = 20 } = {}) {
    const where = ownerWhere(user);
    const take = Math.min(Math.max(parseInt(limit, 10) || 20, 1), MAX_PAGE);
    const [items, unread] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take, select: FIELDS }),
      prisma.notification.count({ where: { ...where, readAt: null } }),
    ]);
    return { items, unread };
  }

  async markRead(user, id) {
    await prisma.notification.updateMany({ where: { ...ownerWhere(user), id, readAt: null }, data: { readAt: new Date() } });
    return { id };
  }

  async markAllRead(user) {
    const { count } = await prisma.notification.updateMany({ where: { ...ownerWhere(user), readAt: null }, data: { readAt: new Date() } });
    return { updated: count };
  }
}

module.exports = new NotificationService();
