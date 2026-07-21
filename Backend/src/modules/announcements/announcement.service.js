const announcementRepository = require('./announcement.repository');
const { NotFoundError } = require('../../utils/errors');

class AnnouncementService {
  async createAnnouncement(data, firmId, createdBy) {
    return await announcementRepository.create({
      ...data,
      firmId,
      createdBy,
    });
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

  async getUserActiveNotices(firmId, userId) {
    return await announcementRepository.findActiveUserNotices(firmId, userId);
  }

  async acknowledgeNotice(id, firmId, userId) {
    const notice = await announcementRepository.findByIdAndFirm(id, firmId);
    if (!notice) {
      throw new NotFoundError('Notice not found');
    }
    return await announcementRepository.markReadOrAcknowledged(id, userId);
  }
}

module.exports = new AnnouncementService();
