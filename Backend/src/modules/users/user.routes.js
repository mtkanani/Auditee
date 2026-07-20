const express = require('express');
const userController = require('./user.controller');
const {
  createUserValidation,
  getUsersValidation,
  userIdParamValidation,
  updateUserValidation,
  changeUserStatusValidation,
  resetUserPasswordValidation,
} = require('./user.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

// Enforce FIRM_ADMIN role access globally for firm admin user management APIs
router.use(authenticateSession);
router.use(authorizeRoles('FIRM_ADMIN'));

router.post('/', createUserValidation, validate, userController.createUser);
router.get('/', getUsersValidation, validate, userController.getAllUsers);
router.get('/:userId', userIdParamValidation, validate, userController.getUserById);
router.put('/:userId', updateUserValidation, validate, userController.updateUser);
router.delete('/:userId', userIdParamValidation, validate, userController.deleteUser);
router.patch('/:userId/status', changeUserStatusValidation, validate, userController.changeUserStatus);
router.post('/:userId/reset-password', resetUserPasswordValidation, validate, userController.resetUserPassword);

module.exports = router;
