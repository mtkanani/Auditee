const prisma = require('../../config/db');

class AnnouncementRepository {
  async create({ firmId, createdBy, title, content, category, priority, expiresAt }) {
    return await prisma.announcement.create({
      data: {
        firmId,
        createdBy,
        title,
        content,
        category: category || 'GENERAL',
        priority: priority || 'INFO',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
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
            select: { reads: true },
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
      return {
        ...item,
        metrics: {
          totalUsers: totalUsersCount,
          readCount: item._count.reads,
          acknowledgedCount,
          acknowledgedPercentage: totalUsersCount > 0 ? Math.round((acknowledgedCount / totalUsersCount) * 100) : 0,
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
      },
    });
  }

  async findActiveUserNotices(firmId, userId) {
    const now = new Date();
    const notices = await prisma.announcement.findMany({
      where: {
        firmId,
        deletedAt: null,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: now } },
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
