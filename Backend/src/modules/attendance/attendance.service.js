const attendanceRepository = require('./attendance.repository');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

class AttendanceService {
  async getTodayStatus(userId, firmId) {
    const record = await attendanceRepository.findTodayRecord(userId, firmId);
    if (!record) {
      return {
        isCheckedIn: false,
        isCheckedOut: false,
        checkInTime: null,
        checkOutTime: null,
        workingHours: 0,
        record: null,
      };
    }

    const isCheckedIn = Boolean(record.checkInTime);
    const isCheckedOut = Boolean(record.checkOutTime);

    let activeWorkingHours = record.workingHours || 0;
    if (isCheckedIn && !isCheckedOut) {
      const diffMs = Date.now() - new Date(record.checkInTime).getTime();
      activeWorkingHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
    }

    return {
      isCheckedIn,
      isCheckedOut,
      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      workingHours: activeWorkingHours,
      record,
    };
  }

  async checkIn(data, userId, firmId) {
    const existing = await attendanceRepository.findTodayRecord(userId, firmId);
    if (existing) {
      throw new BadRequestError('You have already checked in for today');
    }

    return await attendanceRepository.createCheckIn({
      firmId,
      userId,
      lat: data.lat,
      lng: data.lng,
      location: data.location,
      notes: data.notes,
    });
  }

  async checkOut(data, userId, firmId) {
    const record = await attendanceRepository.findTodayRecord(userId, firmId);
    if (!record) {
      throw new BadRequestError('You have not checked in for today yet');
    }

    if (record.checkOutTime) {
      throw new BadRequestError('You have already checked out for today');
    }

    const checkOutTime = new Date();
    const diffMs = checkOutTime.getTime() - new Date(record.checkInTime).getTime();
    const workingHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
    const status = workingHours >= 7.0 ? 'PRESENT' : 'HALF_DAY';

    return await attendanceRepository.updateCheckOut(record.id, {
      checkOutTime,
      workingHours,
      status,
      lat: data.lat,
      lng: data.lng,
      location: data.location,
      notes: data.notes,
    });
  }

  async getMyMonthlyLogs(userId, firmId, month, year) {
    const m = month ? parseInt(month, 10) : new Date().getMonth() + 1;
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return await attendanceRepository.findUserMonthlyLogs(userId, firmId, m, y);
  }

  async getFirmAttendanceReport(firmId, queryParams) {
    const m = queryParams.month ? parseInt(queryParams.month, 10) : new Date().getMonth() + 1;
    const y = queryParams.year ? parseInt(queryParams.year, 10) : new Date().getFullYear();
    return await attendanceRepository.findFirmMasterAttendance({
      firmId,
      month: m,
      year: y,
      search: queryParams.search,
      userId: queryParams.userId,
    });
  }
}

module.exports = new AttendanceService();
