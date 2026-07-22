const leadService = require('./lead.service');

class LeadController {
  async createLead(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const lead = await leadService.createLead(req.body, firmId);
      return res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllLeads(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const leads = await leadService.getAllLeads(req.query, firmId);
      return res.status(200).json({
        success: true,
        message: 'Leads fetched successfully',
        data: leads,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLeadById(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const lead = await leadService.getLeadById(id, firmId);
      return res.status(200).json({
        success: true,
        message: 'Lead details fetched successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLeadStage(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const { stage } = req.body;
      const updated = await leadService.updateLeadStage(id, stage, firmId);
      return res.status(200).json({
        success: true,
        message: `Lead stage updated to ${stage}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async addCallLog(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const log = await leadService.addCallLog(id, req.body, firmId, req.user);
      return res.status(201).json({
        success: true,
        message: 'Call log recorded',
        data: log,
      });
    } catch (error) {
      next(error);
    }
  }

  async addMeetingNote(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const meeting = await leadService.addMeetingNote(id, req.body, firmId, req.user);
      return res.status(201).json({
        success: true,
        message: 'Meeting note saved',
        data: meeting,
      });
    } catch (error) {
      next(error);
    }
  }

  async addProposal(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const proposal = await leadService.addProposal(id, req.body, firmId);
      return res.status(201).json({
        success: true,
        message: 'Proposal fee quotation attached',
        data: proposal,
      });
    } catch (error) {
      next(error);
    }
  }

  async convertToClient(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const performedBy = req.user.id;
      const performedName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Firm Admin';
      const result = await leadService.convertToClient(id, firmId, performedBy, performedName);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.client,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeadController();
