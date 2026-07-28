const reportRepository = require('./report.repository');

class ReportService {
  async getSummaryOverview(firmId) {
    return await reportRepository.getSummaryOverview(firmId);
  }

  async getPendingTasks(firmId, queryParams) {
    return await reportRepository.getPendingTasks(firmId, queryParams);
  }

  async getCompletedTasks(firmId, queryParams) {
    return await reportRepository.getCompletedTasks(firmId, queryParams);
  }

  async getEmployeePerformance(firmId, queryParams) {
    return await reportRepository.getEmployeePerformance(firmId, queryParams);
  }

  async getClientReport(firmId, queryParams) {
    return await reportRepository.getClientReport(firmId, queryParams);
  }

  async getBillingReport(firmId, queryParams) {
    return await reportRepository.getBillingReport(firmId, queryParams);
  }

  async getRevenueReport(firmId, queryParams) {
    return await reportRepository.getRevenueReport(firmId, queryParams);
  }

  async getOutstandingPayments(firmId, queryParams) {
    return await reportRepository.getOutstandingPayments(firmId, queryParams);
  }

  async getComplianceReport(firmId, queryParams) {
    return await reportRepository.getComplianceReport(firmId, queryParams);
  }

  async generateCustomReport(firmId, config) {
    return await reportRepository.generateCustomReport(firmId, config);
  }

  /**
   * Helper to convert array of objects into CSV format string
   */
  convertToCSV(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return 'No data available';
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Header row
    csvRows.push(headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','));

    // Data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        if (val === null || val === undefined) return '""';
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }
}

module.exports = new ReportService();
