const prisma = require('../../config/db');

class MeetingRepository {
  async createMeeting(data) {
    const { participants = [], ...meetingData } = data;
    return await prisma.meeting.create({
      data: {
        ...meetingData,
        participants: {
          create: participants.map((p) => ({
            userId: p.userId ? parseInt(p.userId, 10) : null,
            clientId: p.clientId ? parseInt(p.clientId, 10) : null,
            email: p.email || null,
            status: 'PENDING',
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
            client: { select: { id: true, clientName: true, email: true } },
          },
        },
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findMeetingsByFirm({ firmId, userId, clientId, role, userEmail, search, status, type }) {
    const where = {
      firmId: parseInt(firmId, 10),
    };

    if (status) where.status = status;
    if (type) where.meetingType = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Role-based visibility filtering: CLIENTs see meetings where they are a participant (by clientId, userId, or email)
    if (role === 'CLIENT') {
      const cId = clientId ? parseInt(clientId, 10) : null;
      const uId = userId ? parseInt(userId, 10) : null;
      const cleanEmail = userEmail ? userEmail.trim().toLowerCase() : null;

      const participantConditions = [
        cId ? { clientId: cId } : null,
        uId ? { userId: uId } : null,
        cleanEmail ? { email: { equals: cleanEmail, mode: 'insensitive' } } : null,
      ].filter(Boolean);

      if (participantConditions.length > 0) {
        where.participants = {
          some: {
            OR: participantConditions,
          },
        };
      }
    }

    return await prisma.meeting.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
        participants: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
            client: { select: { id: true, clientName: true, email: true } },
          },
        },
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        notes: true,
        files: true,
        attendanceLogs: true,
        actionItems: true,
      },
    });
  }

  async findMeetingById(meetingId) {
    return await prisma.meeting.findUnique({
      where: { id: parseInt(meetingId, 10) },
      include: {
        participants: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
            client: { select: { id: true, clientName: true, email: true } },
          },
        },
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        notes: {
          include: { createdBy: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        files: {
          include: { uploadedBy: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        chats: {
          include: {
            senderUser: { select: { id: true, firstName: true, lastName: true } },
            senderClient: { select: { id: true, clientName: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        attendanceLogs: true,
        actionItems: true,
      },
    });
  }

  async updateMeeting(id, data) {
    return await prisma.meeting.update({
      where: { id: parseInt(id, 10) },
      data,
    });
  }

  async deleteMeeting(id) {
    return await prisma.meeting.delete({
      where: { id: parseInt(id, 10) },
    });
  }

  async respondInvitation({ meetingId, userId, clientId, status }) {
    const participant = await prisma.meetingParticipant.findFirst({
      where: {
        meetingId: parseInt(meetingId, 10),
        OR: [
          userId ? { userId: parseInt(userId, 10) } : undefined,
          clientId ? { clientId: parseInt(clientId, 10) } : undefined,
        ].filter(Boolean),
      },
    });

    if (!participant) {
      throw new Error('Invitation record not found.');
    }

    return await prisma.meetingParticipant.update({
      where: { id: participant.id },
      data: { status, respondedAt: new Date() },
    });
  }

  async recordAttendance({ meetingId, userId, clientId, status = 'PRESENT' }) {
    return await prisma.meetingAttendance.create({
      data: {
        meetingId: parseInt(meetingId, 10),
        userId: userId ? parseInt(userId, 10) : null,
        clientId: clientId ? parseInt(clientId, 10) : null,
        joinTime: new Date(),
        status,
      },
    });
  }

  async createNote({ meetingId, createdById, title, description, decision, nextSteps }) {
    return await prisma.meetingNote.create({
      data: {
        meetingId: parseInt(meetingId, 10),
        createdById: parseInt(createdById, 10),
        title,
        description,
        decision,
        nextSteps,
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async createActionItems(items) {
    return await prisma.meetingActionItem.createMany({
      data: items,
    });
  }
}

module.exports = new MeetingRepository();
