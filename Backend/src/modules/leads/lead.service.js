const leadRepository = require('./lead.repository');
const clientService = require('../clients/client.service');
const { NotFoundError, BadRequestError } = require('../../utils/errors');

class LeadService {
  async createLead(leadData, firmId) {
    return await leadRepository.createLead({
      firmId,
      leadName: leadData.leadName.trim(),
      companyName: leadData.companyName ? leadData.companyName.trim() : null,
      email: leadData.email.toLowerCase().trim(),
      phone: leadData.phone ? leadData.phone.trim() : null,
      alternatePhone: leadData.alternatePhone ? leadData.alternatePhone.trim() : null,
      businessType: leadData.businessType ? leadData.businessType.trim() : null,
      gstNumber: leadData.gstNumber ? leadData.gstNumber.trim().toUpperCase() : null,
      panNumber: leadData.panNumber ? leadData.panNumber.trim().toUpperCase() : null,
      interestedServices: leadData.interestedServices ? leadData.interestedServices.trim() : null,
      estimatedValue: leadData.estimatedValue ? parseFloat(leadData.estimatedValue) : 0.0,
      source: leadData.source ? leadData.source.trim() : 'DIRECT',
      stage: leadData.stage || 'NEW_LEAD',
      nextFollowUp: leadData.nextFollowUp ? new Date(leadData.nextFollowUp) : null,
      notes: leadData.notes ? leadData.notes.trim() : null,
    });
  }

  async getAllLeads(queryParams, firmId) {
    return await leadRepository.findAllLeads({ ...queryParams, firmId });
  }

  async getLeadById(id, firmId) {
    const lead = await leadRepository.findLeadById(id, firmId);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }
    return lead;
  }

  async updateLeadStage(id, stage, firmId) {
    const lead = await leadRepository.findLeadById(id, firmId);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    await leadRepository.updateLead(id, firmId, { stage });
    return await this.getLeadById(id, firmId);
  }

  async addCallLog(id, logData, firmId, user) {
    const lead = await leadRepository.findLeadById(id, firmId);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    const log = await leadRepository.addCallLog(id, {
      ...logData,
      loggedBy: user.id,
      loggedName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Firm Admin',
    });

    if (logData.followUpDate) {
      await leadRepository.updateLead(id, firmId, {
        nextFollowUp: new Date(logData.followUpDate),
      });
    }

    return log;
  }

  async addMeetingNote(id, meetingData, firmId, user) {
    const lead = await leadRepository.findLeadById(id, firmId);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    return await leadRepository.addMeetingNote(id, {
      ...meetingData,
      loggedBy: user.id,
    });
  }

  async addProposal(id, proposalData, firmId) {
    const lead = await leadRepository.findLeadById(id, firmId);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    const proposal = await leadRepository.addProposal(id, proposalData);

    // Update lead stage to PROPOSAL_SENT if currently NEW_LEAD or DISCUSSION
    if (lead.stage === 'NEW_LEAD' || lead.stage === 'DISCUSSION') {
      await leadRepository.updateLead(id, firmId, { stage: 'PROPOSAL_SENT' });
    }

    return proposal;
  }

  // --- 1-Click Convert Lead to Client ---
  async convertToClient(id, firmId, performedBy, performedName = 'Firm Admin') {
    const lead = await leadRepository.findLeadById(id, firmId);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    if (lead.convertedClientId) {
      throw new BadRequestError('This lead has already been converted to a Client');
    }

    // Auto-create Master Client from Lead fields
    const clientPayload = {
      clientName: lead.leadName,
      companyName: lead.companyName || lead.leadName,
      email: lead.email,
      phone: lead.phone,
      alternatePhone: lead.alternatePhone,
      gstNumber: lead.gstNumber,
      panNumber: lead.panNumber,
      businessType: lead.businessType,
      contactPersonName: lead.leadName,
      contactPersonPhone: lead.phone,
      contactPersonEmail: lead.email,
      status: 'ACTIVE',
    };

    const newClient = await clientService.createClient(clientPayload, firmId, performedBy, performedName);

    // Update Lead stage to WON & link convertedClientId
    await leadRepository.markAsConverted(id, firmId, newClient.id);

    return {
      message: 'Lead converted into Master Client successfully!',
      client: newClient,
    };
  }
}

module.exports = new LeadService();
