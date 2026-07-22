const complianceService = require('./compliance.service');

class ComplianceController {
  async createComplianceItem(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const item = await complianceService.createComplianceItem(req.body, firmId);
      return res.status(201).json({
        success: true,
        message: 'Compliance item created successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllComplianceItems(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const items = await complianceService.getAllComplianceItems(req.query, firmId);
      return res.status(200).json({
        success: true,
        message: 'Compliance items fetched successfully',
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateComplianceStatus(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      const updated = await complianceService.updateComplianceStatus(id, status, firmId);
      return res.status(200).json({
        success: true,
        message: 'Compliance status updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async generateIndianPresets(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const { year, month } = req.body;
      const result = await complianceService.generateIndianPresets(parseInt(year, 10), parseInt(month, 10), firmId);
      return res.status(200).json({
        success: true,
        message: `Indian statutory deadlines generated for ${month}/${year}`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async convertToTask(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const task = await complianceService.convertComplianceToTask(id, req.body, firmId, req.user);
      return res.status(201).json({
        success: true,
        message: 'Compliance item converted into an active Task!',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendReminder(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const notice = await complianceService.sendComplianceReminder(id, firmId, req.user);
      return res.status(201).json({
        success: true,
        message: 'Deadline reminder broadcasted on Notice Board!',
        data: notice,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ComplianceController();
