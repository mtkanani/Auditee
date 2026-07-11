const express = require('express');
const userController = require('../controllers/user.controller');
const { getAllUsersValidation, updateUserProfileValidation } = require('../validations/user.validation');
const validate = require('../middlewares/validate');
const { authenticateSession } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Route: GET /api/users
 * Performs validation checks on page, limit, role, and sorting queries before calling the controller.
 */
router.get(
  '/users',
  [
    ...getAllUsersValidation,
    validate,
  ],
  userController.getAllUsers
);


/**
 * Route: PUT /api/users/update-profile
 * Performs validation checks on user inputs before calling the update controller.
 */
router.put(
  '/users/update-profile',
  [
    authenticateSession,
    ...updateUserProfileValidation,
    validate,
  ],
  userController.updateProfile
);

module.exports = router;
