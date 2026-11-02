const prisma = require('../../config/db');
const announcementRepository = require('./announcement.repository');
const notificationService = require('../notifications/notification.service');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

const STAFF_ROLES = ['USER', 'EMPLOYEE'];

class AnnouncementService {
  /**
   * audience ALL: every active employee (and clients, on their portal). audience SELECTED: only the
   * chosen employees, who must belong to this firm. Each recipient gets a live notification.
   */
  async createAnnouncement(data, firmId, createdBy) {
    const audience = data.audience === 'SELECTED' ? 'SELECTED' : 'ALL';
    const staff = await prisma.user.findMany({
      where: {
        firmId,
        deletedAt: null,
        status: 'ACTIVE',
        role: { in: STAFF_ROLES },
        ...(audience === 'SELECTED' ? { id: { in: [...new Set(data.recipientIds || [])] } } : {}),
      },
      select: { id: true },
    });
    const recipientIds = staff.map((u) => u.id).filter((id) => id !== createdBy);
    if (audience === 'SELECTED' && recipientIds.length === 0) {
      throw new BadRequestError('None of the chosen people are active employees of this firm.');
    }

    const notice = await announcementRepository.create({
      ...data,
      audience,
      recipientIds: audience === 'SELECTED' ? recipientIds : [],
      firmId,
      createdBy,
    });

    notificationService.later(() =>
      recipientIds.map((userId) => ({
        firmId,
        userId,
        type: 'NOTICE',
        title: notice.priority === 'URGENT' ? `Urgent notice: ${notice.title}` : `New notice: ${notice.title}`,
        body: notice.content,
        link: '/user/announcements',
      }))
    );
    return notice;
  }

  async getAllFirmAnnouncements(firmId) {
    return await announcementRepository.findAllByFirm(firmId);
  }

  async getAnnouncementAnalytics(id, firmId) {
    const notice = await announcementRepository.findByIdAndFirm(id, firmId);
    if (!notice) {
      throw new NotFoundError('Notice not found or deleted');
    }
    return notice;
  }

  async deleteAnnouncement(id, firmId) {
    const notice = await announcementRepository.findByIdAndFirm(id, firmId);
    if (!notice) {
      throw new NotFoundError('Notice not found');
    }
    await announcementRepository.softDelete(id, firmId);
    return { message: 'Notice deleted successfully' };
  }

  async getUserActiveNotices(firmId, userId, isClient = false) {
    return await announcementRepository.findActiveUserNotices(firmId, userId, isClient);
  }

  async acknowledgeNotice(id, firmId, userId) {
    const notice = await announcementRepository.findByIdAndFirm(id, firmId);
    if (!notice || (notice.audience === 'SELECTED' && !notice.recipients.some((r) => r.userId === userId))) {
      throw new NotFoundError('Notice not found');
    }
    return await announcementRepository.markReadOrAcknowledged(id, userId);
  }
}

module.exports = new AnnouncementService();
