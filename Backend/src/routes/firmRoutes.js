const express = require('express');
const firmController = require('../controllers/firmController');
const {
  createFirmValidation,
  getFirmsValidation,
  firmIdParamValidation,
  updateFirmValidation,
  updateFirmAdminValidation,
  changeFirmStatusValidation,
  resetFirmAdminPasswordValidation,
} = require('../validations/firmValidation');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Apply SUPER_ADMIN protection globally to all admin firm routes
router.use(authMiddleware);
router.use(roleMiddleware('SUPER_ADMIN'));

/**
 * Route: POST /api/admin/firms
 * Create a new Firm and its Firm Admin.
 */
router.post(
  '/',
  [
    ...createFirmValidation,
    validate,
  ],
  firmController.createFirm
);

/**
 * Route: GET /api/admin/firms
 * Retrieve list of firms with search, pagination, status filter.
 */
router.get(
  '/',
  [
    ...getFirmsValidation,
    validate,
  ],
  firmController.getFirms
);

/**
 * Route: GET /api/admin/firms/:firmId
 * Retrieve a specific firm's details by ID.
 */
router.get(
  '/:firmId',
  [
    ...firmIdParamValidation,
    validate,
  ],
  firmController.getFirmById
);

/**
 * Route: PUT /api/admin/firms/:firmId
 * Update firm details.
 */
router.put(
  '/:firmId',
  [
    ...updateFirmValidation,
    validate,
  ],
  firmController.updateFirm
);

/**
 * Route: PUT /api/admin/firms/:firmId/admin
 * Update firm admin user details.
 */
router.put(
  '/:firmId/admin',
  [
    ...updateFirmAdminValidation,
    validate,
  ],
  firmController.updateFirmAdmin
);

/**
 * Route: PATCH /api/admin/firms/:firmId/status
 * Change firm status.
 */
router.patch(
  '/:firmId/status',
  [
    ...changeFirmStatusValidation,
    validate,
  ],
  firmController.changeFirmStatus
);

/**
 * Route: POST /api/admin/firms/:firmId/admin/reset-password
 * Reset the firm admin's password.
 */
router.post(
  '/:firmId/admin/reset-password',
  [
    ...resetFirmAdminPasswordValidation,
    validate,
  ],
  firmController.resetFirmAdminPassword
);

/**
 * Route: DELETE /api/admin/firms/:firmId
 * Soft delete a firm by setting deletedAt.
 */
router.delete(
  '/:firmId',
  [
    ...firmIdParamValidation,
    validate,
  ],
  firmController.deleteFirm
);

module.exports = router;
