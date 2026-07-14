const express = require('express');
const deleteAccountController = require('../controllers/deleteAccountController');
const {
  sendOtpValidation,
  verifyOtpValidation,
  deleteAccountValidation,
} = require('../validations/deleteAccount.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * Route: POST /api/account/delete/send-otp
 * Validates request schema and triggers the deletion OTP controller.
 */
router.post(
  '/account/delete/send-otp',
  [
    ...sendOtpValidation,
    validate,
  ],
  deleteAccountController.sendDeleteOtp
);

/**
 * Route: POST /api/account/delete/verify-otp
 * Validates request schema and triggers the OTP verification controller.
 */
router.post(
  '/account/delete/verify-otp',
  [
    ...verifyOtpValidation,
    validate,
  ],
  deleteAccountController.verifyDeleteOtp
);

/**
 * Route: DELETE /api/account/delete
 * Validates request schema and permanently deletes the user account.
 */
router.delete(
  '/account/delete',
  [
    ...deleteAccountValidation,
    validate,
  ],
  deleteAccountController.deleteAccount
);

module.exports = router;
