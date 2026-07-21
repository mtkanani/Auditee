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
    const totalUsersCount = await prisma.user.count({
      where: { firmId, deletedAt: null, status: 'ACTIVE' },
    });

    const announcements = await prisma.announcement.findMany({
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
        reads: {
          select: {
            id: true,
            userId: true,
            readAt: true,
            acknowledgedAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                designation: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return announcements.map((item) => {
      const acknowledgedCount = item.reads.filter((r) => r.acknowledgedAt !== null).length;
      const readCount = item.reads.length;
      return {
        ...item,
        metrics: {
          totalUsers: totalUsersCount,
          readCount,
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
    const existing = await prisma.announcementRead.findUnique({
      where: {
        announcementId_userId: { announcementId, userId },
      },
    });

    if (existing) {
      return await prisma.announcementRead.update({
        where: { id: existing.id },
        data: {
          acknowledgedAt: new Date(),
        },
      });
    }

    return await prisma.announcementRead.create({
      data: {
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
