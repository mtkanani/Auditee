const prisma = require('../../config/db');

class LeaveRepository {
  async getOrCreateLeavePolicy(firmId) {
    const fId = parseInt(firmId, 10) || 1;
    let policy = await prisma.leavePolicy.findUnique({
      where: { firmId: fId },
    });

    if (!policy) {
      policy = await prisma.leavePolicy.create({
        data: {
          firmId: fId,
          accrualMode: 'YEARLY',
          casualLeaveQuota: 12.0,
          sickLeaveQuota: 10.0,
          earnedLeaveQuota: 15.0,
          perMonthCasual: 1.0,
          perMonthSick: 0.83,
          perMonthEarned: 1.25,
        },
      });
    }

    return policy;
  }

  async updateLeavePolicy(firmId, data) {
    const fId = parseInt(firmId, 10) || 1;
    return await prisma.leavePolicy.upsert({
      where: { firmId: fId },
      update: data,
      create: {
        firmId: fId,
        ...data,
      },
    });
  }

  async getOrCreateUserLeaveBalance(userId, firmId, year = 2026) {
    let balance = await prisma.leaveBalance.findUnique({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
    });

    if (!balance) {
      const policy = await this.getOrCreateLeavePolicy(firmId);
      balance = await prisma.leaveBalance.create({
        data: {
          firmId,
          userId,
          year,
          casualLeave: policy.casualLeaveQuota,
          casualLeaveUsed: 0.0,
          sickLeave: policy.sickLeaveQuota,
          sickLeaveUsed: 0.0,
          earnedLeave: policy.earnedLeaveQuota,
          earnedLeaveUsed: 0.0,
        },
      });
    }

    return balance;
  }

  async updateUserLeaveBalance(id, data) {
    return await prisma.leaveBalance.update({
      where: { id },
      data,
    });
  }

  async updateUserLeaveBalanceByUserId(userId, firmId, year, data) {
    const balance = await this.getOrCreateUserLeaveBalance(userId, firmId, year);
    return await prisma.leaveBalance.update({
      where: { id: balance.id },
      data,
    });
  }

  async getAllFirmLeaveBalances(firmId, year = 2026) {
    const fId = parseInt(firmId, 10) || 1;
    return await prisma.leaveBalance.findMany({
      where: { firmId: fId, year },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, designation: true } },
      },
    });
  }

  async createLeaveRequest(data) {
    return await prisma.leaveRequest.create({
      data,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, designation: true } },
      },
    });
  }

  async findUserLeaveRequests(userId, firmId) {
    return await prisma.leaveRequest.findMany({
      where: { userId, firmId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPendingLeaveRequests(firmId) {
    const fId = parseInt(firmId, 10) || 1;
    return await prisma.leaveRequest.findMany({
      where: { firmId: fId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, designation: true } },
      },
    });
  }

  async findAllFirmLeaveRequests(firmId) {
    const fId = parseInt(firmId, 10) || 1;
    return await prisma.leaveRequest.findMany({
      where: { firmId: fId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, designation: true } },
      },
    });
  }

  async findLeaveRequestById(id, firmId) {
    return await prisma.leaveRequest.findFirst({
      where: { id, firmId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async updateLeaveRequestStatus(id, firmId, status, adminRemarks, reviewerId) {
    return await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        adminRemarks: adminRemarks ? adminRemarks.trim() : null,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findLeaveCalendarEvents(firmId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return await prisma.leaveRequest.findMany({
      where: {
        firmId,
        status: 'APPROVED',
        OR: [
          { startDate: { lte: endDate }, endDate: { gte: startDate } },
        ],
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, designation: true } },
      },
    });
  }
}

module.exports = new LeaveRepository();
