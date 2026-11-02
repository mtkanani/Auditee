const prisma = require('../../config/db');

class AnnouncementRepository {
  async create({ firmId, createdBy, title, content, category, priority, expiresAt, audience = 'ALL', recipientIds = [] }) {
    return await prisma.announcement.create({
      data: {
        firmId,
        createdBy,
        title,
        content,
        category: category || 'GENERAL',
        priority: priority || 'INFO',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        audience,
        recipients: recipientIds.length ? { createMany: { data: recipientIds.map((userId) => ({ userId })) } } : undefined,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAllByFirm(firmId) {
    const [totalUsersCount, announcements, ackCounts] = await Promise.all([
      prisma.user.count({
        where: { firmId, deletedAt: null, status: 'ACTIVE' },
      }),
      prisma.announcement.findMany({
        where: {
          firmId,
          deletedAt: null,
        },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: { reads: true, recipients: true },
          },
          // Names for "Sent to" on notices that went to chosen people (empty for firm-wide ones).
          recipients: {
            take: 50,
            select: { user: { select: { id: true, firstName: true, lastName: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.announcementRead.groupBy({
        by: ['announcementId'],
        where: {
          announcement: { firmId },
          acknowledgedAt: { not: null },
        },
        _count: { _all: true },
      }),
    ]);

    const ackMap = new Map(ackCounts.map((a) => [a.announcementId, a._count._all]));

    return announcements.map((item) => {
      const acknowledgedCount = ackMap.get(item.id) || 0;
      // A notice sent to chosen people is measured against them, not the whole firm.
      const audienceSize = item.audience === 'SELECTED' ? item._count.recipients : totalUsersCount;
      return {
        ...item,
        metrics: {
          totalUsers: audienceSize,
          readCount: item._count.reads,
          acknowledgedCount,
          acknowledgedPercentage: audienceSize > 0 ? Math.round((acknowledgedCount / audienceSize) * 100) : 0,
        },
      };
    });
  }


  async findByIdAndFirm(id, firmId) {
    return await prisma.announcement.findFirst({
      where: { id, firmId, deletedAt: null },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        reads: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, designation: true },
            },
          },
        },
        recipients: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, designation: true } },
          },
        },
      },
    });
  }

  /** Notices for everyone, plus (for staff) the ones sent to this person. Clients only see firm-wide notices. */
  async findActiveUserNotices(firmId, userId, isClient = false) {
    const now = new Date();
    const notices = await prisma.announcement.findMany({
      where: {
        firmId,
        deletedAt: null,
        AND: [
          { OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] },
          isClient ? { audience: 'ALL' } : { OR: [{ audience: 'ALL' }, { recipients: { some: { userId } } }] },
        ],
      },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true },
        },
        reads: {
          where: { userId },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return notices.map((notice) => {
      const userRead = notice.reads[0] || null;
      return {
        id: notice.id,
        title: notice.title,
        content: notice.content,
        category: notice.category,
        priority: notice.priority,
        audience: notice.audience,
        createdAt: notice.createdAt,
        expiresAt: notice.expiresAt,
        creator: notice.creator,
        isRead: !!userRead,
        isAcknowledged: !!(userRead && userRead.acknowledgedAt),
        acknowledgedAt: userRead ? userRead.acknowledgedAt : null,
      };
    });
  }

  async markReadOrAcknowledged(announcementId, userId) {
    return await prisma.announcementRead.upsert({
      where: {
        announcementId_userId: { announcementId, userId },
      },
      update: {
        acknowledgedAt: new Date(),
      },
      create: {
        announcementId,
        userId,
        readAt: new Date(),
        acknowledgedAt: new Date(),
      },
    });
  }


  async softDelete(id, firmId) {
    return await prisma.announcement.updateMany({
      where: { id, firmId },
      data: { deletedAt: new Date() },
    });
  }
}

module.exports = new AnnouncementRepository();
