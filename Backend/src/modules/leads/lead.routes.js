const express = require('express');
const leadController = require('./lead.controller');
const {
  createLeadValidation,
  updateLeadStageValidation,
  addCallLogValidation,
  addMeetingNoteValidation,
  addProposalValidation,
} = require('./lead.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);
router.use(authorizeRoles('FIRM_ADMIN'));

router.post('/', createLeadValidation, validate, leadController.createLead);
router.get('/', leadController.getAllLeads);
router.get('/:id', leadController.getLeadById);
router.patch('/:id/stage', updateLeadStageValidation, validate, leadController.updateLeadStage);

router.post('/:id/call-logs', addCallLogValidation, validate, leadController.addCallLog);
router.post('/:id/meeting-notes', addMeetingNoteValidation, validate, leadController.addMeetingNote);
router.post('/:id/proposals', addProposalValidation, validate, leadController.addProposal);

router.post('/:id/convert-to-client', leadController.convertToClient);

module.exports = router;
