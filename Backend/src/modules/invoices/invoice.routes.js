const express = require('express');
const invoiceController = require('./invoice.controller');
const { createInvoiceValidation, addPaymentValidation } = require('./invoice.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);

// Accessible by both FIRM_ADMIN and CLIENT
router.get('/bank-details', authorizeRoles('FIRM_ADMIN', 'CLIENT'), invoiceController.getBankDetails);
router.get('/', authorizeRoles('FIRM_ADMIN', 'CLIENT'), invoiceController.getAllInvoices);
router.get('/:id', authorizeRoles('FIRM_ADMIN', 'CLIENT'), invoiceController.getInvoiceById);
router.post('/:id/payments', authorizeRoles('FIRM_ADMIN', 'CLIENT'), addPaymentValidation, validate, invoiceController.recordPayment);

// Accessible ONLY by FIRM_ADMIN
router.put('/bank-details', authorizeRoles('FIRM_ADMIN'), invoiceController.updateBankDetails);
router.post('/', authorizeRoles('FIRM_ADMIN'), createInvoiceValidation, validate, invoiceController.createInvoice);
router.post('/:id/convert-proforma', authorizeRoles('FIRM_ADMIN'), invoiceController.convertProforma);
router.post('/:id/send-email', authorizeRoles('FIRM_ADMIN'), invoiceController.sendInvoiceEmail);

module.exports = router;
