const announcementService = require('./announcement.service');

class AnnouncementController {
  async createAnnouncement(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const createdBy = req.user.id;
      const data = await announcementService.createAnnouncement(req.body, firmId, createdBy);
      return res.status(201).json({
        success: true,
        message: 'Notice broadcast created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllFirmAnnouncements(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const data = await announcementService.getAllFirmAnnouncements(firmId);
      return res.status(200).json({
        success: true,
        message: 'Firm notices retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAnnouncementAnalytics(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const data = await announcementService.getAnnouncementAnalytics(id, firmId);
      return res.status(200).json({
        success: true,
        message: 'Notice analytics fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAnnouncement(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const result = await announcementService.deleteAnnouncement(id, firmId);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserActiveNotices(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = req.user.id;
      const data = await announcementService.getUserActiveNotices(firmId, userId);
      return res.status(200).json({
        success: true,
        message: 'Active firm notices fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async acknowledgeNotice(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = req.user.id;
      const id = parseInt(req.params.id, 10);
      const data = await announcementService.acknowledgeNotice(id, firmId, userId);
      return res.status(200).json({
        success: true,
        message: 'Notice acknowledged successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnnouncementController();
