const { body, param, query } = require('express-validator');

const createClientValidation = [
  body('clientName')
    .trim()
    .notEmpty()
    .withMessage('Client name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Client name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .optional({ nullable: true })
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('clientType')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Client type cannot be empty'),
  body('companyName')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Company name cannot exceed 150 characters'),
  body('phone')
    .optional({ nullable: true })
    .trim()
    .isMobilePhone()
    .withMessage('Invalid phone number format'),
  body('gstNumber')
    .optional({ nullable: true })
    .trim()
    .toUpperCase()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Invalid Indian GST format (e.g. 22AAAAA0000A1Z5)'),
  body('panNumber')
    .optional({ nullable: true })
    .trim()
    .toUpperCase()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage('Invalid Indian PAN format (e.g. ABCDE1234F)'),
  body('businessType')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Business type cannot exceed 100 characters'),
  body('address')
    .optional({ nullable: true })
    .trim(),
  body('city')
    .optional({ nullable: true })
    .trim(),
  body('state')
    .optional({ nullable: true })
    .trim(),
  body('country')
    .optional({ nullable: true })
    .trim(),
  body('pincode')
    .optional({ nullable: true })
    .trim()
    .isPostalCode('IN')
    .withMessage('Invalid pincode format'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be ACTIVE or INACTIVE'),
];

const getClientsValidation = [
  query('page')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('search')
    .optional({ checkFalsy: true })
    .trim(),
  query('gstSearch')
    .optional({ checkFalsy: true })
    .trim(),
  query('status')
    .optional({ checkFalsy: true })
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be ACTIVE or INACTIVE'),
  query('sortBy')
    .optional({ checkFalsy: true })
    .isIn(['clientName', 'companyName', 'email', 'createdAt'])
    .withMessage('Invalid sortBy field'),
  query('sortOrder')
    .optional({ checkFalsy: true })
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];

const clientIdParamValidation = [
  param('clientId')
    .isInt({ min: 1 })
    .withMessage('Client ID must be a valid positive integer')
    .toInt(),
];

const updateClientValidation = [
  ...clientIdParamValidation,
  body('clientName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Client name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional({ nullable: true })
    .trim()
    .isMobilePhone()
    .withMessage('Invalid phone number format'),
  body('gstNumber')
    .optional({ nullable: true })
    .trim()
    .toUpperCase()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Invalid Indian GST format (e.g. 22AAAAA0000A1Z5)'),
  body('panNumber')
    .optional({ nullable: true })
    .trim()
    .toUpperCase()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage('Invalid Indian PAN format (e.g. ABCDE1234F)'),
  body('pincode')
    .optional({ nullable: true })
    .trim()
    .isPostalCode('IN')
    .withMessage('Invalid pincode format'),
];

const changeClientStatusValidation = [
  ...clientIdParamValidation,
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be ACTIVE or INACTIVE'),
];

module.exports = {
  createClientValidation,
  getClientsValidation,
  clientIdParamValidation,
  updateClientValidation,
  changeClientStatusValidation,
};
