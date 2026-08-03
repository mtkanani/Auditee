const meetingRepository = require('./meeting.repository');
const prisma = require('../../config/db');
const { sendEmail } = require('../../services/emailService');

class MeetingService {
  async scheduleMeeting(user, data) {
    const firmId = user.firmId || 1;
    const {
      title,
      description,
      agenda,
      meetingType = 'CLIENT',
      meetingMode = 'IN_APP_VIDEO',
      priority = 'MEDIUM',
      department,
      location,
      meetingDate,
      startTime,
      endTime,
      participants = [],
    } = data;

    const parsedMeetingDate = new Date(meetingDate || Date.now());
    const parsedStart = new Date(startTime || Date.now());
    const parsedEnd = new Date(endTime || Date.now() + 3600000);

    // Auto-generate video meeting room link if IN_APP_VIDEO
    const meetingRoomId = `auditee-room-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const generatedLink = meetingMode === 'IN_APP_VIDEO'
      ? `/meeting-room/${meetingRoomId}`
      : data.meetingLink || 'https://meet.google.com';

    // Resolve participant emails to actual User or Client IDs in database
    const resolvedParticipants = [];
    for (const p of participants) {
      const email = p.email ? p.email.trim().toLowerCase() : '';
      let targetUserId = p.userId ? parseInt(p.userId, 10) : null;
      let targetClientId = p.clientId ? parseInt(p.clientId, 10) : null;

      if (email) {
        if (!targetUserId) {
          const u = await prisma.user.findUnique({ where: { email }, select: { id: true } });
          if (u) targetUserId = u.id;
        }
        if (!targetClientId && !targetUserId) {
          const c = await prisma.client.findUnique({ where: { email }, select: { id: true } });
          if (c) targetClientId = c.id;
        }
      }

      resolvedParticipants.push({
        userId: targetUserId,
        clientId: targetClientId,
        email: email || undefined,
      });
    }

    const meeting = await meetingRepository.createMeeting({
      firmId: parseInt(firmId, 10),
      title,
      description,
      agenda,
      meetingType,
      meetingMode,
      priority,
      department,
      location,
      meetingLink: generatedLink,
      meetingDate: parsedMeetingDate,
      startTime: parsedStart,
      endTime: parsedEnd,
      createdById: parseInt(user.id, 10),
      participants: resolvedParticipants,
    });

    // Asynchronously dispatch invitation emails in background
    this.sendInvitationEmails(meeting).catch((err) => {
      console.warn('⚠️ Meeting invitation email warning:', err.message);
    });

    return meeting;
  }

  async inviteParticipantToLiveMeeting(user, meetingId, participantData) {
    const meeting = await meetingRepository.findMeetingById(meetingId);
    if (!meeting) throw new Error('Meeting not found.');

    const { email, userId, clientId } = participantData;
    let targetUserId = userId ? parseInt(userId, 10) : null;
    let targetClientId = clientId ? parseInt(clientId, 10) : null;
    let targetEmail = email ? email.trim().toLowerCase() : '';

    if (targetEmail) {
      if (!targetUserId) {
        const u = await prisma.user.findUnique({ where: { email: targetEmail }, select: { id: true } });
        if (u) targetUserId = u.id;
      }
      if (!targetClientId && !targetUserId) {
        const c = await prisma.client.findUnique({ where: { email: targetEmail }, select: { id: true } });
        if (c) targetClientId = c.id;
      }
    }

    const participant = await prisma.meetingParticipant.create({
      data: {
        meetingId: parseInt(meetingId, 10),
        userId: targetUserId,
        clientId: targetClientId,
        email: targetEmail || undefined,
        status: 'PENDING',
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        client: { select: { id: true, clientName: true, email: true } },
      },
    });

    this.sendInvitationEmails({
      ...meeting,
      participants: [participant],
    }).catch(() => {});

    return participant;
  }

  async sendInvitationEmails(meeting) {
    if (!meeting.participants || meeting.participants.length === 0) return;

    for (const p of meeting.participants) {
      const recipientEmail = p.email || p.user?.email || p.client?.email;
      if (!recipientEmail) continue;

      const subject = `📅 Invitation: ${meeting.title} - Auditee Meeting`;
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; rounded: 12px;">
          <h2 style="color: #6366f1;">📅 Meeting Invitation: ${meeting.title}</h2>
          <p>You have been invited to a meeting on Auditee.</p>
          <ul>
            <li><strong>Date:</strong> ${new Date(meeting.meetingDate).toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${new Date(meeting.startTime).toLocaleTimeString()} - ${new Date(meeting.endTime).toLocaleTimeString()}</li>
            <li><strong>Mode:</strong> ${meeting.meetingMode}</li>
            <li><strong>Link:</strong> <a href="${meeting.meetingLink}" style="color: #818cf8;">Join Meeting</a></li>
          </ul>
          <p>Please log in to your Auditee dashboard to accept or decline the invitation.</p>
        </div>
      `;

      sendEmail({ to: recipientEmail, subject, text: `Invitation to ${meeting.title}`, html }).catch(() => {});
    }
  }

  async getMeetings(user, query) {
    const firmId = user.firmId || 1;
    return await meetingRepository.findMeetingsByFirm({
      firmId,
      userId: user.id,
      clientId: user.clientId || (user.role === 'CLIENT' ? user.id : null),
      role: user.role,
      search: query.search,
      status: query.status,
      type: query.type,
    });
  }

  async getMeetingById(id) {
    const meeting = await meetingRepository.findMeetingById(id);
    if (!meeting) {
      throw new Error('Meeting not found.');
    }
    return meeting;
  }

  async updateMeetingStatus(id, status) {
    return await meetingRepository.updateMeeting(id, { status });
  }

  async respondInvitation(user, { meetingId, status }) {
    return await meetingRepository.respondInvitation({
      meetingId,
      userId: user.role !== 'CLIENT' ? user.id : null,
      clientId: user.role === 'CLIENT' ? user.id : null,
      status,
    });
  }

  async recordJoinAttendance(user, meetingId) {
    return await meetingRepository.recordAttendance({
      meetingId,
      userId: user.role !== 'CLIENT' ? user.id : null,
      clientId: user.role === 'CLIENT' ? user.id : null,
      status: 'PRESENT',
    });
  }

  async addMeetingNote(user, { meetingId, title, description, decision, nextSteps }) {
    return await meetingRepository.createNote({
      meetingId,
      createdById: user.id,
      title,
      description,
      decision,
      nextSteps,
    });
  }

  /**
   * ✨ AI Action Item Converter:
   * Parses MoM notes using Gemini API (or intelligent fallback) and automatically creates real assigned Auditee tasks!
   */
  async convertMoMToTasks(user, { meetingId, notesText }) {
    const meeting = await meetingRepository.findMeetingById(meetingId);
    if (!meeting) throw new Error('Meeting not found.');

    const firmId = user.firmId || 1;
    let actionItems = [];

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `Extract action items from these Meeting Notes into JSON format array of objects with keys "title", "description", "dueDateInDays":\n\nNotes:\n${notesText}`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await response.json();
        const jsonMatch = data.candidates?.[0]?.content?.parts?.[0]?.text?.match(/\[.*\]/s);
        if (jsonMatch) {
          actionItems = JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn('AI Parsing failed, falling back to manual split:', err.message);
      }
    }

    if (!actionItems || actionItems.length === 0) {
      // Intelligent fallback splitter
      actionItems = notesText
        .split('\n')
        .filter((line) => line.trim().length > 5)
        .map((line, idx) => ({
          title: `Action Item ${idx + 1}: ${line.replace(/^[-*0-9.]+\s*/, '').substring(0, 60)}`,
          description: line,
          dueDateInDays: 3,
        }));
    }

    // Create real Auditee tasks in DB
    const createdTasks = [];
    for (const item of actionItems) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (item.dueDateInDays || 3));

      const newTask = await prisma.task.create({
        data: {
          firmId: parseInt(firmId, 10),
          title: item.title || 'Meeting Action Task',
          description: `From Meeting: ${meeting.title}\n${item.description || ''}`,
          priority: 'MEDIUM',
          status: 'PENDING',
          dueDate,
          createdByType: user.role === 'CLIENT' ? 'CLIENT' : 'EMPLOYEE',
          createdBy: parseInt(user.id, 10),
        },
      });
      createdTasks.push(newTask);
    }

    return {
      message: `Successfully created ${createdTasks.length} tasks from Meeting Notes!`,
      tasks: createdTasks,
    };
  }
}

module.exports = new MeetingService();
