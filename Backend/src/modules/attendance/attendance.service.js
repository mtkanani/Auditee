const attendanceRepository = require('./attendance.repository');
const { BadRequestError } = require('../../utils/errors');
const { calculateDistanceMeters } = require('../../utils/geofence.util');

class AttendanceService {
  async validateGeofence(firmId, userLat, userLng) {
    const firm = await attendanceRepository.getFirmGeofenceSettings(firmId);
    if (!firm || !firm.geofenceEnabled) {
      return; // Geofencing is disabled, allow check-in/out from anywhere
    }

    if (firm.officeLat === null || firm.officeLng === null) {
      throw new BadRequestError(
        'Firm admin has enabled geofencing but office GPS coordinates are not configured yet. Please contact your Firm Admin.'
      );
    }

    if (userLat === undefined || userLat === null || userLng === undefined || userLng === null) {
      throw new BadRequestError('GPS location coordinates are required for geofenced check-in/check-out.');
    }

    const uLat = parseFloat(userLat);
    const uLng = parseFloat(userLng);
    const distanceMeters = calculateDistanceMeters(uLat, uLng, firm.officeLat, firm.officeLng);
    const maxRadius = firm.geofenceRadiusMeters || 100;

    if (distanceMeters > maxRadius) {
      const currentDistFormatted = distanceMeters >= 1000 ? `${(distanceMeters / 1000).toFixed(2)}km` : `${Math.round(distanceMeters)}m`;
      throw new BadRequestError(
        `Location Restriction: You are outside the allowed office check-in area. Current Distance: ${currentDistFormatted} (Allowed Office Radius: ${maxRadius}m).`
      );
    }
  }

  async getTodayStatus(userId, firmId) {
    if (!firmId) {
      return {
        isCheckedIn: false,
        isCheckedOut: false,
        hasOpenEntry: false,
        entries: [],
        workingHours: 0,
        record: null,
      };
    }

    const [record, geofence] = await Promise.all([
      attendanceRepository.findTodayRecord(userId, firmId),
      attendanceRepository.getFirmGeofenceSettings(firmId),
    ]);

    if (!record) {
      return {
        isCheckedIn: false,
        isCheckedOut: false,
        hasOpenEntry: false,
        entries: [],
        workingHours: 0,
        record: null,
        geofence,
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
      geofence,
    };
  }

  async checkIn(data, userId, firmId) {
    if (!firmId) {
      throw new BadRequestError('You must be assigned to an active firm to use attendance features.');
    }

    // Validate Geofence restriction
    await this.validateGeofence(firmId, data.lat, data.lng);

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
    if (!firmId) {
      throw new BadRequestError('You must be assigned to an active firm to use attendance features.');
    }

    // Validate Geofence restriction
    await this.validateGeofence(firmId, data.lat, data.lng);

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
    if (!firmId) return [];
    const m = month ? parseInt(month, 10) : new Date().getMonth() + 1;
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return await attendanceRepository.findUserMonthlyLogs(userId, firmId, m, y);
  }

  async getFirmAttendanceReport(firmId, queryParams) {
    if (!firmId) return { records: [], total: 0 };
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

  async getGeofenceSettings(firmId) {
    if (!firmId) throw new BadRequestError('Firm ID is required');
    const settings = await attendanceRepository.getFirmGeofenceSettings(firmId);
    return (
      settings || {
        geofenceEnabled: false,
        officeLat: null,
        officeLng: null,
        officeAddress: null,
        geofenceRadiusMeters: 100,
      }
    );
  }

  async updateGeofenceSettings(firmId, data) {
    if (!firmId) throw new BadRequestError('Firm ID is required');
    return await attendanceRepository.updateFirmGeofenceSettings(firmId, data);
  }
}

module.exports = new AttendanceService();
