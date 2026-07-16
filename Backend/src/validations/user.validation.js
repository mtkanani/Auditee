const { query, body } = require('express-validator');

/**
 * Validation rules for the GET /api/users endpoint query parameters.
 */
const getAllUsersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive number.')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be a positive number between 1 and 100.')
    .toInt(),
  query('role')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['user', 'admin', 'super_admin', 'firm_admin', 'employee', 'client']).withMessage('Role must be one of: user, admin, super_admin, firm_admin, employee, client.'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['firstName', 'email', 'city', 'createdAt']).withMessage('sortBy must be one of: firstName, email, city, createdAt.'),
  query('sortOrder')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['asc', 'desc']).withMessage('sortOrder must be either asc or desc.'),
];

/**
 * Validation rules for the PUT /api/users/update-profile endpoint body.
 */
const updateUserProfileValidation = [
  body('userId')
    .notEmpty().withMessage('User ID is required.')
    .isInt({ min: 1 }).withMessage('User ID must be a valid positive integer.')
    .toInt(),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters.'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters.'),
  body('mobileNumber')
    .optional()
    .trim()
    .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be exactly 10 digits.')
    .isNumeric().withMessage('Mobile number must be numeric.'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City must not exceed 100 characters.'),
];

module.exports = {
  getAllUsersValidation,
  updateUserProfileValidation,
};
