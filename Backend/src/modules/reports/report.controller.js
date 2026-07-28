const reportService = require('./report.service');

class ReportController {
  async getSummaryOverview(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const data = await reportService.getSummaryOverview(firmId);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getReport(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const { reportType } = req.params;
      const queryParams = req.query;

      let data;
      switch (reportType) {
        case 'pending-tasks':
          data = await reportService.getPendingTasks(firmId, queryParams);
          break;
        case 'completed-tasks':
          data = await reportService.getCompletedTasks(firmId, queryParams);
          break;
        case 'employee-performance':
          data = await reportService.getEmployeePerformance(firmId, queryParams);
          break;
        case 'client-report':
          data = await reportService.getClientReport(firmId, queryParams);
          break;
        case 'billing-report':
          data = await reportService.getBillingReport(firmId, queryParams);
          break;
        case 'revenue-report':
          data = await reportService.getRevenueReport(firmId, queryParams);
          break;
        case 'outstanding-payments':
          data = await reportService.getOutstandingPayments(firmId, queryParams);
          break;
        case 'compliance-report':
          data = await reportService.getComplianceReport(firmId, queryParams);
          break;
        default:
          return res.status(400).json({
            success: false,
            message: `Invalid report type: ${reportType}`,
          });
      }

      return res.status(200).json({
        success: true,
        reportType,
        count: Array.isArray(data) ? data.length : undefined,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async generateCustomReport(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const config = req.body;
      const data = await reportService.generateCustomReport(firmId, config);
      return res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async exportReportCSV(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const { reportType } = req.params;
      const queryParams = req.query;

      let data;
      if (reportType === 'custom') {
        data = await reportService.generateCustomReport(firmId, req.body || {});
      } else {
        switch (reportType) {
          case 'pending-tasks':
            data = await reportService.getPendingTasks(firmId, queryParams);
            break;
          case 'completed-tasks':
            data = await reportService.getCompletedTasks(firmId, queryParams);
            break;
          case 'employee-performance':
            data = await reportService.getEmployeePerformance(firmId, queryParams);
            break;
          case 'client-report':
            data = await reportService.getClientReport(firmId, queryParams);
            break;
          case 'billing-report':
            data = await reportService.getBillingReport(firmId, queryParams);
            break;
          case 'revenue-report':
            const revRes = await reportService.getRevenueReport(firmId, queryParams);
            data = revRes.recentTransactions;
            break;
          case 'outstanding-payments':
            data = await reportService.getOutstandingPayments(firmId, queryParams);
            break;
          case 'compliance-report':
            data = await reportService.getComplianceReport(firmId, queryParams);
            break;
          default:
            return res.status(400).json({ success: false, message: 'Invalid report type' });
        }
      }

      const csvContent = reportService.convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType}-report-${Date.now()}.csv"`);
      return res.status(200).send(csvContent);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
