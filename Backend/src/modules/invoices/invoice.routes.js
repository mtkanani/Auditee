const express = require('express');
const invoiceController = require('./invoice.controller');
const { createInvoiceValidation, addPaymentValidation } = require('./invoice.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);

router.get('/bank-details', invoiceController.getBankDetails);
router.put('/bank-details', authorizeRoles('FIRM_ADMIN'), invoiceController.updateBankDetails);

router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);

router.post('/:id/payments', authorizeRoles('FIRM_ADMIN', 'CLIENT'), addPaymentValidation, validate, invoiceController.recordPayment);

router.use(authorizeRoles('FIRM_ADMIN'));

router.post('/', createInvoiceValidation, validate, invoiceController.createInvoice);
router.post('/:id/convert-proforma', invoiceController.convertProforma);
router.post('/:id/send-email', invoiceController.sendInvoiceEmail);

module.exports = router;
