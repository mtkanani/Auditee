const complianceRepository = require('./compliance.repository');
const taskRepository = require('../tasks/task.repository');
const announcementRepository = require('../announcements/announcement.repository');
const { NotFoundError } = require('../../utils/errors');

class ComplianceService {
  async createComplianceItem(data, firmId) {
    return await complianceRepository.createComplianceItem({
      firmId,
      clientId: data.clientId ? parseInt(data.clientId, 10) : null,
      title: data.title.trim(),
      category: data.category || 'GST',
      dueDate: new Date(data.dueDate),
      period: data.period ? data.period.trim() : null,
      priority: data.priority || 'MEDIUM',
      status: data.status || 'UPCOMING',
      penaltyDetails: data.penaltyDetails ? data.penaltyDetails.trim() : null,
    });
  }

  async getAllComplianceItems(queryParams, firmId) {
    return await complianceRepository.findAllComplianceItems({ ...queryParams, firmId });
  }

  async updateComplianceStatus(id, status, firmId) {
    const existing = await complianceRepository.findComplianceById(id, firmId);
    if (!existing) {
      throw new NotFoundError('Compliance item not found');
    }

    await complianceRepository.updateComplianceItem(id, firmId, { status });
    return await complianceRepository.findComplianceById(id, firmId);
  }

  async generateIndianPresets(year, month, firmId) {
    return await complianceRepository.generateIndianStatutoryPresets(firmId, year, month);
  }

  async convertComplianceToTask(id, taskOptions, firmId, user) {
    const item = await complianceRepository.findComplianceById(id, firmId);
    if (!item) {
      throw new NotFoundError('Compliance item not found');
    }

    const taskTitle = `[Compliance] ${item.title}`;
    const taskDesc = `Statutory Compliance Filing for ${item.client?.companyName || item.client?.clientName || 'Firm Clients'}.\nPeriod: ${item.period || 'N/A'}.\nDue Date: ${new Date(item.dueDate).toLocaleDateString()}.\nNotes/Penalty: ${item.penaltyDetails || 'Standard statutory deadline'}`;

    const defaultSubtasks = [
      `Collect & verify raw data for ${item.title}`,
      `Reconcile tax ledgers & calculate liability`,
      `Generate draft return summary & obtain approval`,
      `File statutory return on portal with DSC/EVC`,
    ];

    const task = await taskRepository.createTask(
      {
        firmId,
        clientId: item.clientId,
        title: taskTitle,
        description: taskDesc,
        priority: item.priority || 'HIGH',
        status: 'PENDING',
        dueDate: item.dueDate,
        createdByType: 'FIRM_ADMIN',
        createdBy: user.id,
      },
      taskOptions.assignedUserIds || [],
      defaultSubtasks
    );

    // Link autoTaskId & update compliance status to IN_PROGRESS
    await complianceRepository.updateComplianceItem(id, firmId, {
      autoTaskId: task.id,
      status: 'IN_PROGRESS',
    });

    return task;
  }

  async sendComplianceReminder(id, firmId, user) {
    const item = await complianceRepository.findComplianceById(id, firmId);
    if (!item) {
      throw new NotFoundError('Compliance item not found');
    }

    const noticeTitle = `🚨 URGENT DEADLINE: ${item.title}`;
    const noticeContent = `Important compliance deadline reminder:\n\nFiling Item: ${item.title}\nCategory: ${item.category}\nDue Date: ${new Date(item.dueDate).toLocaleDateString()}\nApplicable Period: ${item.period || 'Current Period'}\n\nPlease submit all necessary documents & verification to your CA auditor immediately to prevent statutory late fees.`;

    const notice = await announcementRepository.create({
      firmId,
      title: noticeTitle,
      content: noticeContent,
      category: 'COMPLIANCE',
      priority: 'URGENT',
      createdBy: user.id,
      expiresAt: new Date(item.dueDate),
    });

    return notice;
  }
}

module.exports = new ComplianceService();
