const express = require('express');
const router = express.Router();
const documentController = require('./document.controller');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');
const validate = require('../../middlewares/validate');
const { uploadDocumentValidation } = require('./document.validation');

// All document routes require authentication
router.use(authenticateSession);

// Upload a document to the vault (Firm Admin, Employee, Client)
router.post(
  '/upload',
  uploadDocumentValidation,
  validate,
  documentController.uploadDocument.bind(documentController)
);

// Firm Admin — get all firm documents
router.get(
  '/firm',
  authorizeRoles('FIRM_ADMIN'),
  documentController.getFirmVault.bind(documentController)
);

// Client — get client documents
router.get(
  '/client',
  documentController.getClientVault.bind(documentController)
);

// Employee (User) — get user vault documents
router.get(
  '/user',
  documentController.getUserVault.bind(documentController)
);

// Delete a document (soft delete)
router.delete(
  '/:id',
  documentController.deleteDocument.bind(documentController)
);

module.exports = router;
