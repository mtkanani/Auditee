const prisma = require('../../config/db');

class AttendanceRepository {
  getTodayDateOnly() {
    const d = new Date();
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  }

  // Get or create today's AttendanceRecord (the parent day record)
  async findOrCreateTodayRecord(userId, firmId) {
    const today = this.getTodayDateOnly();
    let record = await prisma.attendanceRecord.findFirst({
      where: { userId, firmId, date: today },
      include: {
        entries: { orderBy: { checkInTime: 'asc' } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    if (!record) {
      record = await prisma.attendanceRecord.create({
        data: { firmId, userId, date: today, status: 'PRESENT', workingHours: 0 },
        include: {
          entries: { orderBy: { checkInTime: 'asc' } },
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      });
    }
    return record;
  }

  async findTodayRecord(userId, firmId) {
    const today = this.getTodayDateOnly();
    return await prisma.attendanceRecord.findFirst({
      where: { userId, firmId, date: today },
      include: {
        entries: { orderBy: { checkInTime: 'asc' } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  // Create a new check-in entry
  async createEntry({ recordId, lat, lng, location }) {
    return await prisma.attendanceEntry.create({
      data: {
        recordId,
        checkInTime: new Date(),
        checkInLat: lat ? parseFloat(lat) : null,
        checkInLng: lng ? parseFloat(lng) : null,
        checkInLocation: location ? location.trim() : 'Web Verified Location',
      },
    });
  }

  // Find the latest open (not checked-out) entry for today
  async findOpenEntry(recordId) {
    return await prisma.attendanceEntry.findFirst({
      where: { recordId, checkOutTime: null },
      orderBy: { checkInTime: 'desc' },
    });
  }

  // Close an entry with check-out info, and update parent record total hours
  async closeEntry(entryId, { lat, lng, location, durationHours }) {
    const entry = await prisma.attendanceEntry.update({
      where: { id: entryId },
      data: {
        checkOutTime: new Date(),
        durationHours,
        checkOutLat: lat ? parseFloat(lat) : null,
        checkOutLng: lng ? parseFloat(lng) : null,
        checkOutLocation: location ? location.trim() : 'Web Verified Location',
      },
    });

    // Recalculate total working hours for the day from all closed entries
    const record = await prisma.attendanceRecord.findUnique({ where: { id: entry.recordId } });
    const allEntries = await prisma.attendanceEntry.findMany({
      where: { recordId: entry.recordId, checkOutTime: { not: null } },
    });
    const totalHours = allEntries.reduce((sum, e) => sum + (e.durationHours || 0), 0);
    const status = totalHours >= 7.0 ? 'PRESENT' : 'HALF_DAY';

    await prisma.attendanceRecord.update({
      where: { id: entry.recordId },
      data: { workingHours: parseFloat(totalHours.toFixed(2)), status },
    });

    return entry;
  }

  async findUserMonthlyLogs(userId, firmId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    return await prisma.attendanceRecord.findMany({
      where: { userId, firmId, date: { gte: startDate, lte: endDate } },
      orderBy: { date: 'desc' },
      include: { entries: { orderBy: { checkInTime: 'asc' } } },
    });
  }

  async findFirmMasterAttendance({ firmId, month, year, search, userId }) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const where = { firmId, date: { gte: startDate, lte: endDate } };
    if (userId) where.userId = parseInt(userId, 10);
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
        entries: { orderBy: { checkInTime: 'asc' } },
      },
    });
  }
}

module.exports = new AttendanceRepository();
