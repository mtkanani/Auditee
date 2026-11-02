const notificationService = require('./notification.service');

class NotificationController {
  async list(req, res, next) {
    try {
      const data = await notificationService.list(req.user, { limit: req.query.limit });
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async markRead(req, res, next) {
    try {
      const data = await notificationService.markRead(req.user, parseInt(req.params.id, 10));
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async markAllRead(req, res, next) {
    try {
      const data = await notificationService.markAllRead(req.user);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
