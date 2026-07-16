const { body, query, param } = require('express-validator');

/**
 * Validation rules for POST /api/admin/firms (Create Firm)
 */
const createFirmValidation = [
  body('firm')
    .notEmpty().withMessage('Firm details object is required.')
    .isObject().withMessage('Firm must be an object.'),
  body('firm.firmName')
    .trim()
    .notEmpty().withMessage('Firm name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Firm name must be between 2 and 100 characters.'),
  body('firm.email')
    .trim()
    .notEmpty().withMessage('Firm email is required.')
    .isEmail().withMessage('Invalid firm email address format.'),
  body('firm.phone')
    .trim()
    .notEmpty().withMessage('Firm phone number is required.')
    .isLength({ min: 10, max: 15 }).withMessage('Firm phone number must be between 10 and 15 digits.'),
  body('firm.address')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Address cannot exceed 255 characters.'),
  body('firm.city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City cannot exceed 100 characters.'),
  body('firm.state')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('State cannot exceed 100 characters.'),
  body('firm.country')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Country cannot exceed 100 characters.'),
  body('firm.pincode')
    .optional()
    .trim()
    .isLength({ min: 4, max: 10 }).withMessage('Pincode must be between 4 and 10 characters.'),

  body('firmAdmin')
    .notEmpty().withMessage('Firm admin details object is required.')
    .isObject().withMessage('FirmAdmin must be an object.'),
  body('firmAdmin.firstName')
    .trim()
    .notEmpty().withMessage('Admin first name is required.')
    .isLength({ min: 2, max: 50 }).withMessage('Admin first name must be between 2 and 50 characters.'),
  body('firmAdmin.lastName')
    .trim()
    .notEmpty().withMessage('Admin last name is required.')
    .isLength({ min: 2, max: 50 }).withMessage('Admin last name must be between 2 and 50 characters.'),
  body('firmAdmin.email')
    .trim()
    .notEmpty().withMessage('Admin email is required.')
    .isEmail().withMessage('Invalid admin email address format.'),
  body('firmAdmin.phone')
    .trim()
    .notEmpty().withMessage('Admin phone number is required.')
    .isLength({ min: 10, max: 15 }).withMessage('Admin phone number must be between 10 and 15 digits.'),
  body('firmAdmin.password')
    .trim()
    .notEmpty().withMessage('Admin password is required.')
    .isLength({ min: 8 }).withMessage('Admin password must be at least 8 characters long.')
    .matches(/[A-Z]/).withMessage('Admin password must contain at least one uppercase letter.')
    .matches(/[a-z]/).withMessage('Admin password must contain at least one lowercase letter.')
    .matches(/[0-9]/).withMessage('Admin password must contain at least one number.')
    .matches(/[^A-Za-z0-9]/).withMessage('Admin password must contain at least one special character.'),
];

/**
 * Validation rules for GET /api/admin/firms (Get All Firms)
 */
const getFirmsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer.')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be a positive integer between 1 and 100.')
    .toInt(),
  query('search')
    .optional()
    .trim(),
  query('status')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Status must be ACTIVE, INACTIVE, or SUSPENDED.'),
];

/**
 * Validation rules for firmId param
 */
const firmIdParamValidation = [
  param('firmId')
    .notEmpty().withMessage('Firm ID is required in URL parameters.')
    .isInt({ min: 1 }).withMessage('Firm ID must be a positive integer.')
    .toInt(),
];

/**
 * Validation rules for PUT /api/admin/firms/:firmId (Update Firm)
 */
const updateFirmValidation = [
  ...firmIdParamValidation,
  body('firmName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Firm name must be between 2 and 100 characters.'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email address format.'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits.'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Address cannot exceed 255 characters.'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City cannot exceed 100 characters.'),
  body('state')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('State cannot exceed 100 characters.'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Country cannot exceed 100 characters.'),
  body('pincode')
    .optional()
    .trim()
    .isLength({ min: 4, max: 10 }).withMessage('Pincode must be between 4 and 10 characters.'),
];

/**
 * Validation rules for PUT /api/admin/firms/:firmId/admin (Update Firm Admin)
 */
const updateFirmAdminValidation = [
  ...firmIdParamValidation,
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters.'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters.'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email address format.'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits.'),
];

/**
 * Validation rules for PATCH /api/admin/firms/:firmId/status (Change Status)
 */
const changeFirmStatusValidation = [
  ...firmIdParamValidation,
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required.')
    .toUpperCase()
    .isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Status must be ACTIVE, INACTIVE, or SUSPENDED.'),
];

/**
 * Validation rules for POST /api/admin/firms/:firmId/admin/reset-password (Reset Admin Password)
 */
const resetFirmAdminPasswordValidation = [
  ...firmIdParamValidation,
  body('newPassword')
    .trim()
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long.')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter.')
    .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter.')
    .matches(/[0-9]/).withMessage('New password must contain at least one number.')
    .matches(/[^A-Za-z0-9]/).withMessage('New password must contain at least one special character.'),
];

module.exports = {
  createFirmValidation,
  getFirmsValidation,
  firmIdParamValidation,
  updateFirmValidation,
  updateFirmAdminValidation,
  changeFirmStatusValidation,
  resetFirmAdminPasswordValidation,
};
