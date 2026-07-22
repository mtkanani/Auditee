const express = require('express');
const invoiceController = require('./invoice.controller');
const { createInvoiceValidation, addPaymentValidation } = require('./invoice.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);

router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);

router.use(authorizeRoles('FIRM_ADMIN'));

router.post('/', createInvoiceValidation, validate, invoiceController.createInvoice);
router.post('/:id/payments', addPaymentValidation, validate, invoiceController.recordPayment);
router.post('/:id/convert-proforma', invoiceController.convertProforma);
router.post('/:id/send-email', invoiceController.sendInvoiceEmail);

module.exports = router;
