const { body, param, query } = require('express-validator');

const createUserValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional({ nullable: true })
    .trim()
    .isMobilePhone()
    .withMessage('Invalid phone number format'),
  body('designation')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Designation cannot exceed 100 characters'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be ACTIVE or INACTIVE'),
  body('joiningDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Joining date must be a valid ISO date string'),
  body('profileImage')
    .optional({ nullable: true })
    .isURL()
    .withMessage('Profile image must be a valid URL'),
];

const getUsersValidation = [
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
  query('sortBy')
    .optional({ checkFalsy: true })
    .isIn(['firstName', 'lastName', 'email', 'designation', 'status', 'createdAt'])
    .withMessage('Invalid sortBy field'),
  query('sortOrder')
    .optional({ checkFalsy: true })
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
  query('status')
    .optional({ checkFalsy: true })
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status filter must be ACTIVE or INACTIVE'),
  query('designation')
    .optional({ checkFalsy: true })
    .trim(),
];

const userIdParamValidation = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a valid positive integer')
    .toInt(),
];

const updateUserValidation = [
  ...userIdParamValidation,
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
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
  body('designation')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Designation cannot exceed 100 characters'),
  body('profileImage')
    .optional({ nullable: true })
    .isURL()
    .withMessage('Profile image must be a valid URL'),
  body('joiningDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Joining date must be a valid ISO date string'),
];

const changeUserStatusValidation = [
  ...userIdParamValidation,
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be ACTIVE or INACTIVE'),
];

const resetUserPasswordValidation = [
  ...userIdParamValidation,
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

module.exports = {
  createUserValidation,
  getUsersValidation,
  userIdParamValidation,
  updateUserValidation,
  changeUserStatusValidation,
  resetUserPasswordValidation,
};
