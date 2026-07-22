const attendanceRepository = require('./attendance.repository');
const { BadRequestError } = require('../../utils/errors');

class AttendanceService {
  async getTodayStatus(userId, firmId) {
    const record = await attendanceRepository.findTodayRecord(userId, firmId);
    if (!record) {
      return {
        isCheckedIn: false,
        isCheckedOut: false,
        hasOpenEntry: false,
        entries: [],
        workingHours: 0,
        record: null,
      };
    }

    const entries = record.entries || [];
    const openEntry = entries.find((e) => !e.checkOutTime);
    const hasOpenEntry = Boolean(openEntry);

    // Live working hours = closed entries total + current open session duration
    let liveHours = record.workingHours || 0;
    if (openEntry) {
      const diffMs = Date.now() - new Date(openEntry.checkInTime).getTime();
      liveHours = record.workingHours + diffMs / (1000 * 60 * 60);
    }

    return {
      isCheckedIn: entries.length > 0,
      hasOpenEntry,
      isCheckedOut: entries.length > 0 && !hasOpenEntry,
      openEntry: openEntry || null,
      entries,
      workingHours: parseFloat(liveHours.toFixed(2)),
      totalWorkingHours: record.workingHours,
      record,
    };
  }

  async checkIn(data, userId, firmId) {
    // Get or create today's day record
    const record = await attendanceRepository.findOrCreateTodayRecord(userId, firmId);

    // Check if there's already an open (unchecked-out) entry
    const openEntry = await attendanceRepository.findOpenEntry(record.id);
    if (openEntry) {
      throw new BadRequestError('You are currently checked in. Please Check Out before checking in again.');
    }

    // Create a new entry
    const entry = await attendanceRepository.createEntry({
      recordId: record.id,
      lat: data.lat,
      lng: data.lng,
      location: data.location,
    });

    return { record, entry };
  }

  async checkOut(data, userId, firmId) {
    const record = await attendanceRepository.findTodayRecord(userId, firmId);
    if (!record) {
      throw new BadRequestError('You have not checked in for today yet.');
    }

    const openEntry = await attendanceRepository.findOpenEntry(record.id);
    if (!openEntry) {
      throw new BadRequestError('You are not currently checked in. Please Check In first.');
    }

    const checkOutTime = new Date();
    const diffMs = checkOutTime.getTime() - new Date(openEntry.checkInTime).getTime();
    const durationHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(4));

    const entry = await attendanceRepository.closeEntry(openEntry.id, {
      lat: data.lat,
      lng: data.lng,
      location: data.location,
      durationHours,
    });

    // Fetch updated record with all entries
    const updatedRecord = await attendanceRepository.findTodayRecord(userId, firmId);
    return { record: updatedRecord, entry, workingHours: updatedRecord.workingHours };
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
