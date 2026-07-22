const leaveService = require('./leave.service');

class LeaveController {
  async applyLeave(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = req.user.id;
      const request = await leaveService.applyLeave(req.body, userId, firmId);
      return res.status(201).json({
        success: true,
        message: 'Leave application submitted successfully',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

  async reviewLeave(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const { status, adminRemarks } = req.body;
      const reviewerId = req.user.id;
      const updated = await leaveService.reviewLeave(id, status, adminRemarks, firmId, reviewerId);
      return res.status(200).json({
        success: true,
        message: `Leave application ${status.toLowerCase()} successfully`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyLeaveData(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = req.user.id;
      const data = await leaveService.getMyLeaveData(userId, firmId);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPendingRequests(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const data = await leaveService.getPendingLeaveRequests(firmId);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLeaveCalendar(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const { month, year } = req.query;
      const calendar = await leaveService.getLeaveCalendar(firmId, month, year);
      return res.status(200).json({
        success: true,
        data: calendar,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeaveController();
