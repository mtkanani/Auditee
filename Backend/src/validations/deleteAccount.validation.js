const { body } = require('express-validator');

/**
 * Validation rules for POST /api/account/delete/send-otp
 */
const sendOtpValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Invalid email address format.'),
];

/**
 * Validation rules for POST /api/account/delete/verify-otp
 */
const verifyOtpValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Invalid email address format.'),
  body('otp')
    .trim()
    .notEmpty().withMessage('OTP code is required.')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits.')
    .isNumeric().withMessage('OTP code must be numeric.'),
];

/**
 * Validation rules for DELETE /api/account/delete
 */
const deleteAccountValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Invalid email address format.'),
];

module.exports = {
  sendOtpValidation,
  verifyOtpValidation,
  deleteAccountValidation,
};
