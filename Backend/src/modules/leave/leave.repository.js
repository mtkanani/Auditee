const prisma = require('../../config/db');

class LeaveRepository {
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
      balance = await prisma.leaveBalance.create({
        data: {
          firmId,
          userId,
          year,
          casualLeave: 12.0,
          casualLeaveUsed: 0.0,
          sickLeave: 10.0,
          sickLeaveUsed: 0.0,
          earnedLeave: 15.0,
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
    return await prisma.leaveRequest.findMany({
      where: { firmId, status: 'PENDING' },
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
