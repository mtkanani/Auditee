const leaveRepository = require('./leave.repository');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

class LeaveService {
  async applyLeave(data, userId, firmId) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate < startDate) {
      throw new BadRequestError('End date cannot be before start date');
    }

    const diffTime = Math.abs(endDate - startDate);
    const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = data.totalDays ? parseFloat(data.totalDays) : calculatedDays;

    const currentYear = new Date().getFullYear();
    const balance = await leaveRepository.getOrCreateUserLeaveBalance(userId, firmId, currentYear);

    // Check quota availability
    if (data.leaveType === 'CASUAL_LEAVE') {
      const remaining = balance.casualLeave - balance.casualLeaveUsed;
      if (totalDays > remaining) {
        throw new BadRequestError(`Insufficient Casual Leave balance. Remaining: ${remaining} days`);
      }
    } else if (data.leaveType === 'SICK_LEAVE') {
      const remaining = balance.sickLeave - balance.sickLeaveUsed;
      if (totalDays > remaining) {
        throw new BadRequestError(`Insufficient Sick Leave balance. Remaining: ${remaining} days`);
      }
    } else if (data.leaveType === 'EARNED_LEAVE') {
      const remaining = balance.earnedLeave - balance.earnedLeaveUsed;
      if (totalDays > remaining) {
        throw new BadRequestError(`Insufficient Earned Leave balance. Remaining: ${remaining} days`);
      }
    }

    return await leaveRepository.createLeaveRequest({
      firmId,
      userId,
      leaveType: data.leaveType,
      startDate,
      endDate,
      totalDays,
      reason: data.reason.trim(),
      status: 'PENDING',
    });
  }

  async reviewLeave(id, status, adminRemarks, firmId, reviewerId) {
    const request = await leaveRepository.findLeaveRequestById(id, firmId);
    if (!request) {
      throw new NotFoundError('Leave request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestError(`Leave request has already been ${request.status}`);
    }

    if (status === 'APPROVED') {
      const currentYear = new Date(request.startDate).getFullYear();
      const balance = await leaveRepository.getOrCreateUserLeaveBalance(request.userId, firmId, currentYear);

      const updateData = {};
      if (request.leaveType === 'CASUAL_LEAVE') {
        updateData.casualLeaveUsed = balance.casualLeaveUsed + request.totalDays;
      } else if (request.leaveType === 'SICK_LEAVE') {
        updateData.sickLeaveUsed = balance.sickLeaveUsed + request.totalDays;
      } else if (request.leaveType === 'EARNED_LEAVE') {
        updateData.earnedLeaveUsed = balance.earnedLeaveUsed + request.totalDays;
      }

      if (Object.keys(updateData).length > 0) {
        await leaveRepository.updateUserLeaveBalance(balance.id, updateData);
      }
    }

    return await leaveRepository.updateLeaveRequestStatus(id, firmId, status, adminRemarks, reviewerId);
  }

  async getMyLeaveData(userId, firmId) {
    const currentYear = new Date().getFullYear();
    const balance = await leaveRepository.getOrCreateUserLeaveBalance(userId, firmId, currentYear);
    const requests = await leaveRepository.findUserLeaveRequests(userId, firmId);
    return { balance, requests };
  }

  async getPendingLeaveRequests(firmId) {
    const pendingRequests = await leaveRepository.findPendingLeaveRequests(firmId);
    return {
      count: pendingRequests.length,
      pendingRequests,
    };
  }

  async getLeaveCalendar(firmId, month, year) {
    const m = month ? parseInt(month, 10) : new Date().getMonth() + 1;
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return await leaveRepository.findLeaveCalendarEvents(firmId, m, y);
  }
}

module.exports = new LeaveService();
