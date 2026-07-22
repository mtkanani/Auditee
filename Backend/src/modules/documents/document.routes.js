const express = require('express');
const router = express.Router();
const documentController = require('./document.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validateRequest } = require('../../middlewares/validateRequest');
const { uploadDocumentValidation } = require('./document.validation');

// Firm Admin Routes
router.post(
  '/upload',
  authenticate,
  authorize(['FIRM_ADMIN', 'ADMIN', 'USER', 'CLIENT']),
  uploadDocumentValidation,
  validateRequest,
  documentController.uploadDocument.bind(documentController)
);

router.get(
  '/firm',
  authenticate,
  authorize(['FIRM_ADMIN', 'ADMIN']),
  documentController.getFirmVault.bind(documentController)
);

router.get(
  '/client',
  authenticate,
  authorize(['CLIENT', 'FIRM_ADMIN', 'ADMIN']),
  documentController.getClientVault.bind(documentController)
);

router.get(
  '/user',
  authenticate,
  authorize(['USER', 'FIRM_ADMIN', 'ADMIN']),
  documentController.getUserVault.bind(documentController)
);

router.delete(
  '/:id',
  authenticate,
  authorize(['FIRM_ADMIN', 'ADMIN', 'USER']),
  documentController.deleteDocument.bind(documentController)
);

module.exports = router;
