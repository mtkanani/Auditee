const { body, param, query } = require('express-validator');

const uploadDocumentValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Document title is required'),
  body('fileUrl')
    .trim()
    .notEmpty()
    .withMessage('File URL is required'),
  body('fileName')
    .trim()
    .notEmpty()
    .withMessage('File name is required'),
  body('category')
    .optional()
    .isIn([
      'GST_FILINGS',
      'INCOME_TAX',
      'AUDIT_REPORTS',
      'ROC_MCA',
      'FINANCIAL_STATEMENTS',
      'KYC_LEGAL',
      'GENERAL',
    ])
    .withMessage('Invalid document category'),
  body('clientId')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .toInt(),
  body('taskId')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .toInt(),
  body('isConfidential')
    .optional()
    .isBoolean()
    .toBoolean(),
  body('notes')
    .optional({ nullable: true })
    .trim(),
];

module.exports = {
  uploadDocumentValidation,
};
