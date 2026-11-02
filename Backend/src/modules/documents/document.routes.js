const express = require('express');
const router = express.Router();
const documentController = require('./document.controller');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');
const validate = require('../../middlewares/validate');
const { uploadUrlValidation, uploadDocumentValidation, documentIdValidation } = require('./document.validation');

// All document routes require authentication
router.use(authenticateSession);

// Step 1 of an upload: get a short-lived URL to PUT the file to (Firm Admin, Employee, Client)
router.post(
  '/upload-url',
  uploadUrlValidation,
  validate,
  documentController.createUploadUrl.bind(documentController)
);

// Step 2: save the document to the vault once the file is stored
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
  authorizeRoles('CLIENT'),
  documentController.getClientVault.bind(documentController)
);

// Employee (User) — get user vault documents
router.get(
  '/user',
  authorizeRoles('USER'),
  documentController.getUserVault.bind(documentController)
);

// Short-lived download link, after an access check
router.get(
  '/:id/download',
  documentIdValidation,
  validate,
  documentController.getDownloadUrl.bind(documentController)
);

// Delete a document (soft delete)
router.delete(
  '/:id',
  documentIdValidation,
  validate,
  documentController.deleteDocument.bind(documentController)
);

module.exports = router;
