const authService = require('../services/authService');

/**
 * Controller for sending OTP.
 */
const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.requestOtp(email);
    
    return res.status(200).json({
      status: 'success',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for verifying OTP.
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);

    return res.status(200).json({
      status: 'success',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for User Registration.
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for User Login.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      tokens: result.tokens,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for User Change Password.
 */
const changePassword = async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    await authService.updateUserPassword(email, currentPassword, newPassword);
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to send Forgot Password OTP.
 */
const sendForgotPasswordOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.requestForgotPasswordOtp(email);
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to verify Forgot Password OTP.
 */
const verifyForgotPasswordOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyForgotPasswordOtp(email, otp);
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to Reset Password using verified OTP.
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    await authService.resetUserPassword(email, newPassword);
    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  register,
  login,
  changePassword,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
};
