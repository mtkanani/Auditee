const deleteAccountService = require('../services/deleteAccountService');

/**
 * Controller to send account deletion OTP
 */
const sendDeleteOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await deleteAccountService.requestDeleteOtp(email);
    
    return res.status(200).json({
      success: true,
      message: result.message || 'OTP sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to verify account deletion OTP
 */
const verifyDeleteOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await deleteAccountService.verifyDeleteOtp(email, otp);
    
    return res.status(200).json({
      success: true,
      message: result.message || 'OTP verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to permanently delete user account
 */
const deleteAccount = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await deleteAccountService.deleteUserAccount(email);
    
    return res.status(200).json({
      success: true,
      message: result.message || 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendDeleteOtp,
  verifyDeleteOtp,
  deleteAccount,
};
