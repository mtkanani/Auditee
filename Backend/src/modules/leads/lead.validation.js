const { body, param, query } = require('express-validator');

const createLeadValidation = [
  body('leadName')
    .trim()
    .notEmpty()
    .withMessage('Lead contact name is required'),
  body('companyName')
    .optional({ nullable: true })
    .trim(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('phone')
    .optional({ nullable: true })
    .trim(),
  body('alternatePhone')
    .optional({ nullable: true })
    .trim(),
  body('businessType')
    .optional({ nullable: true })
    .trim(),
  body('gstNumber')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .toUpperCase(),
  body('panNumber')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .toUpperCase(),
  body('interestedServices')
    .optional({ nullable: true })
    .trim(),
  body('estimatedValue')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Estimated value must be a non-negative number'),
  body('source')
    .optional()
    .trim(),
  body('stage')
    .optional()
    .isIn(['NEW_LEAD', 'DISCUSSION', 'PROPOSAL_SENT', 'WON', 'LOST'])
    .withMessage('Invalid lead stage'),
  body('nextFollowUp')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601(),
  body('notes')
    .optional({ nullable: true })
    .trim(),
];

const updateLeadStageValidation = [
  param('id')
    .isInt({ min: 1 })
    .toInt(),
  body('stage')
    .notEmpty()
    .isIn(['NEW_LEAD', 'DISCUSSION', 'PROPOSAL_SENT', 'WON', 'LOST'])
    .withMessage('Invalid lead stage'),
];

const addCallLogValidation = [
  param('id')
    .isInt({ min: 1 })
    .toInt(),
  body('callSummary')
    .trim()
    .notEmpty()
    .withMessage('Call summary is required'),
  body('durationMinutes')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .toInt(),
  body('followUpDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601(),
];

const addMeetingNoteValidation = [
  param('id')
    .isInt({ min: 1 })
    .toInt(),
  body('meetingTitle')
    .trim()
    .notEmpty()
    .withMessage('Meeting title is required'),
  body('meetingNotes')
    .trim()
    .notEmpty()
    .withMessage('Meeting notes cannot be empty'),
  body('meetingDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601(),
  body('attendees')
    .optional({ nullable: true })
    .trim(),
];

const addProposalValidation = [
  param('id')
    .isInt({ min: 1 })
    .toInt(),
  body('proposalTitle')
    .trim()
    .notEmpty()
    .withMessage('Proposal title is required'),
  body('proposedFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Proposed fee must be a positive number'),
  body('billingFrequency')
    .optional()
    .isIn(['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'ANNUALLY']),
  body('scopeDescription')
    .optional({ nullable: true })
    .trim(),
  body('fileUrl')
    .optional({ nullable: true })
    .trim(),
];

module.exports = {
  createLeadValidation,
  updateLeadStageValidation,
  addCallLogValidation,
  addMeetingNoteValidation,
  addProposalValidation,
};
