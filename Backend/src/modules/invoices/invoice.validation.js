const { body, param, query } = require('express-validator');

const createInvoiceValidation = [
  body('clientId')
    .notEmpty()
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Client ID is required'),
  body('invoiceType')
    .optional()
    .isIn(['TAX_INVOICE', 'PROFORMA'])
    .withMessage('Invoice type must be TAX_INVOICE or PROFORMA'),
  body('issueDate')
    .optional()
    .isISO8601(),
  body('dueDate')
    .notEmpty()
    .isISO8601()
    .withMessage('Due date is required'),
  body('placeOfSupply')
    .optional({ nullable: true })
    .trim(),
  body('isInterState')
    .optional()
    .isBoolean()
    .toBoolean(),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Invoice must contain at least 1 line item'),
  body('items.*.description')
    .trim()
    .notEmpty()
    .withMessage('Item description is required'),
  body('items.*.sacCode')
    .optional({ nullable: true })
    .trim(),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .toInt(),
  body('items.*.unitPrice')
    .notEmpty()
    .isFloat({ min: 0 })
    .toFloat()
    .withMessage('Unit price must be a non-negative number'),
  body('items.*.gstRate')
    .optional()
    .isFloat({ min: 0 })
    .toFloat(),
  body('notes')
    .optional({ nullable: true })
    .trim(),
  body('terms')
    .optional({ nullable: true })
    .trim(),
];

const addPaymentValidation = [
  param('id')
    .isInt({ min: 1 })
    .toInt(),
  body('amount')
    .notEmpty()
    .isFloat({ min: 0.01 })
    .toFloat()
    .withMessage('Payment amount must be greater than 0'),
  body('paymentDate')
    .optional()
    .isISO8601(),
  body('paymentMode')
    .optional()
    .trim(),
  body('referenceNumber')
    .optional({ nullable: true })
    .trim(),
  body('notes')
    .optional({ nullable: true })
    .trim(),
];

module.exports = {
  createInvoiceValidation,
  addPaymentValidation,
};
