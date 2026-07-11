const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * Route: POST /api/auth/send-otp
 * Validates request schema and forwards to the controller.
 */
router.post(
  '/send-otp',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email address is required.')
      .isEmail().withMessage('Invalid email address format.'),
    validate,
  ],
  authController.sendOtp
);

/**
 * Route: POST /api/auth/verify-otp
 * Validates email and OTP format and forwards to the controller.
 */
router.post(
  '/verify-otp',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email address is required.')
      .isEmail().withMessage('Invalid email address format.'),
    body('otp')
      .trim()
      .notEmpty().withMessage('OTP code is required.')
      .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits.')
      .isNumeric().withMessage('OTP code must be numeric.'),
    validate,
  ],
  authController.verifyOtp
);

/**
 * Route: POST /api/auth/register
 * Validates complete user details including password complexity and confirm password match.
 */
router.post(
  '/register',
  [
    body('firstName')
      .trim()
      .notEmpty().withMessage('First name is required.')
      .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters.'),
    body('lastName')
      .trim()
      .notEmpty().withMessage('Last name is required.')
      .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters.'),
    body('mobileNumber')
      .trim()
      .notEmpty().withMessage('Mobile number is required.')
      .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be exactly 10 digits.')
      .isNumeric().withMessage('Mobile number must be numeric.'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email address is required.')
      .isEmail().withMessage('Invalid email address format.'),
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required.')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
      .matches(/[0-9]/).withMessage('Password must contain at least one number.')
      .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character.'),
    body('confirmPassword')
      .trim()
      .notEmpty().withMessage('Confirm password is required.')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password and Confirm Password do not match');
        }
        return true;
      }),
    body('city')
      .trim()
      .notEmpty().withMessage('City is required.')
      .isLength({ max: 100 }).withMessage('City must not exceed 100 characters.'),
    body('role')
      .optional()
      .trim()
      .isIn(['user', 'admin']).withMessage('Role must be either user or admin.'),
    validate,
  ],
  authController.register
);

/**
 * Route: POST /api/auth/login
 * Validates email and password parameters and forwards to login controller.
 */
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email address is required.')
      .isEmail().withMessage('Invalid email address format.'),
    body('password')
      .notEmpty().withMessage('Password is required.'),
    validate,
  ],
  authController.login
);

/**
 * Route: POST /api/auth/change-password
 * Validates credentials, checks new password complexity, and forwards to change-password controller.
 */
router.post(
  '/change-password',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email address is required.')
      .isEmail().withMessage('Invalid email address format.'),
    body('currentPassword')
      .notEmpty().withMessage('Current password is required.'),
    body('newPassword')
      .trim()
      .notEmpty().withMessage('New password is required.')
      .isLength({ min: 8, max: 50 }).withMessage('New password must be between 8 and 50 characters.')
      .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter.')
      .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter.')
      .matches(/[0-9]/).withMessage('New password must contain at least one number.')
      .matches(/[^A-Za-z0-9]/).withMessage('New password must contain at least one special character.'),
    validate,
  ],
  authController.changePassword
);

/**
 * Route: POST /api/auth/forgot-password/send-otp
 * Validates request email and forwards to send-otp forgot password controller.
 */
router.post(
  '/forgot-password/send-otp',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email address is required.')
      .isEmail().withMessage('Invalid email address format.'),
    validate,
  ],
  authController.sendForgotPasswordOtp
);

/**
 * Route: POST /api/auth/forgot-password/verify-otp
 * Validates request email and otp format and forwards to verify-otp forgot password controller.
 */
router.post(
  '/forgot-password/verify-otp',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email address is required.')
      .isEmail().withMessage('Invalid email address format.'),
    body('otp')
      .trim()
      .notEmpty().withMessage('OTP code is required.')
      .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits.')
      .isNumeric().withMessage('OTP code must be numeric.'),
    validate,
  ],
  authController.verifyForgotPasswordOtp
);

/**
 * Route: POST /api/auth/forgot-password/reset-password
 * Validates reset password details and password complexity and forwards to reset-password controller.
 */
router.post(
  '/forgot-password/reset-password',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email address is required.')
      .isEmail().withMessage('Invalid email address format.'),
    body('newPassword')
      .trim()
      .notEmpty().withMessage('New password is required.')
      .isLength({ min: 8, max: 50 }).withMessage('New password must be between 8 and 50 characters.')
      .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter.')
      .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter.')
      .matches(/[0-9]/).withMessage('New password must contain at least one number.')
      .matches(/[^A-Za-z0-9]/).withMessage('New password must contain at least one special character.'),
    body('confirmPassword')
      .trim()
      .notEmpty().withMessage('Confirm password is required.')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password and Confirm Password do not match');
        }
        return true;
      }),
    validate,
  ],
  authController.resetPassword
);

module.exports = router;
