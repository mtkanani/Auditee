const prisma = require('../../config/db');

class LeadRepository {
  async createLead(data) {
    return await prisma.lead.create({
      data,
    });
  }

  async findAllLeads({ firmId, stage, search, source }) {
    const where = {
      firmId,
      deletedAt: null,
    };

    if (stage) {
      where.stage = stage;
    }

    if (source) {
      where.source = source;
    }

    if (search) {
      where.OR = [
        { leadName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { interestedServices: { contains: search, mode: 'insensitive' } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        convertedClient: { select: { id: true, clientName: true, companyName: true } },
        _count: {
          select: { callLogs: true, meetingNotes: true, proposals: true },
        },
      },
    });

    return leads;
  }

  async findLeadById(id, firmId) {
    return await prisma.lead.findFirst({
      where: { id, firmId, deletedAt: null },
      include: {
        convertedClient: { select: { id: true, clientName: true, companyName: true, email: true } },
        callLogs: { orderBy: { createdAt: 'desc' } },
        meetingNotes: { orderBy: { createdAt: 'desc' } },
        proposals: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async updateLead(id, firmId, data) {
    return await prisma.lead.updateMany({
      where: { id, firmId, deletedAt: null },
      data,
    });
  }

  async addCallLog(leadId, { callSummary, durationMinutes, followUpDate, loggedBy, loggedName }) {
    return await prisma.leadCallLog.create({
      data: {
        leadId,
        callSummary: callSummary.trim(),
        durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        loggedBy: loggedBy || null,
        loggedName: loggedName || 'Firm Admin',
      },
    });
  }

  async addMeetingNote(leadId, { meetingTitle, meetingNotes, meetingDate, attendees, loggedBy }) {
    return await prisma.leadMeetingNote.create({
      data: {
        leadId,
        meetingTitle: meetingTitle.trim(),
        meetingNotes: meetingNotes.trim(),
        meetingDate: meetingDate ? new Date(meetingDate) : new Date(),
        attendees: attendees ? attendees.trim() : null,
        loggedBy: loggedBy || null,
      },
    });
  }

  async addProposal(leadId, { proposalTitle, proposedFee, billingFrequency, scopeDescription, fileUrl }) {
    return await prisma.leadProposal.create({
      data: {
        leadId,
        proposalTitle: proposalTitle.trim(),
        proposedFee: proposedFee ? parseFloat(proposedFee) : 0.0,
        billingFrequency: billingFrequency || 'MONTHLY',
        scopeDescription: scopeDescription ? scopeDescription.trim() : null,
        fileUrl: fileUrl ? fileUrl.trim() : null,
      },
    });
  }

  async markAsConverted(leadId, firmId, clientId) {
    return await prisma.lead.updateMany({
      where: { id: leadId, firmId },
      data: {
        stage: 'WON',
        convertedClientId: clientId,
      },
    });
  }
}

module.exports = new LeadRepository();
