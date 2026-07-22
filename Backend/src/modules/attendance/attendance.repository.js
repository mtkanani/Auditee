const prisma = require('../../config/db');

class AttendanceRepository {
  getTodayDateOnly() {
    const d = new Date();
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  }

  async findTodayRecord(userId, firmId) {
    const today = this.getTodayDateOnly();
    return await prisma.attendanceRecord.findFirst({
      where: {
        userId,
        firmId,
        date: today,
      },
    });
  }

  async createCheckIn({ firmId, userId, lat, lng, location, notes }) {
    const today = this.getTodayDateOnly();
    return await prisma.attendanceRecord.create({
      data: {
        firmId,
        userId,
        date: today,
        checkInTime: new Date(),
        status: 'PRESENT',
        checkInLat: lat ? parseFloat(lat) : null,
        checkInLng: lng ? parseFloat(lng) : null,
        checkInLocation: location ? location.trim() : 'GPS Verified Location',
        notes: notes ? notes.trim() : null,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async updateCheckOut(id, { checkOutTime, workingHours, status, lat, lng, location, notes }) {
    return await prisma.attendanceRecord.update({
      where: { id },
      data: {
        checkOutTime,
        workingHours,
        status,
        checkOutLat: lat ? parseFloat(lat) : null,
        checkOutLng: lng ? parseFloat(lng) : null,
        checkOutLocation: location ? location.trim() : 'GPS Verified Location',
        notes: notes ? notes.trim() : undefined,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findUserMonthlyLogs(userId, firmId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return await prisma.attendanceRecord.findMany({
      where: {
        userId,
        firmId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findFirmMasterAttendance({ firmId, month, year, search, userId }) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const where = {
      firmId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) {
      where.userId = parseInt(userId, 10);
    }

    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    return await prisma.attendanceRecord.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, designation: true, role: true } },
      },
    });
  }
}

module.exports = new AttendanceRepository();
