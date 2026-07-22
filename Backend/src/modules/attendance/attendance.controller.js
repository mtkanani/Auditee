const attendanceService = require('./attendance.service');

class AttendanceController {
  async getTodayStatus(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = req.user.id;
      const result = await attendanceService.getTodayStatus(userId, firmId);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkIn(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = req.user.id;
      const record = await attendanceService.checkIn(req.body, userId, firmId);
      return res.status(201).json({
        success: true,
        message: 'Checked in successfully with GPS location!',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkOut(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = req.user.id;
      const record = await attendanceService.checkOut(req.body, userId, firmId);
      return res.status(200).json({
        success: true,
        message: `Checked out successfully! Total Working Hours: ${record.workingHours} hrs`,
        data: record,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyLogs(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = req.user.id;
      const { month, year } = req.query;
      const logs = await attendanceService.getMyMonthlyLogs(userId, firmId, month, year);
      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFirmReport(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const report = await attendanceService.getFirmAttendanceReport(firmId, req.query);
      return res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AttendanceController();
