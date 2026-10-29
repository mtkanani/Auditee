const { body, param, query } = require('express-validator');

const uploadUrlValidation = [
  body('fileName')
    .trim()
    .notEmpty()
    .withMessage('File name is required')
    .isLength({ max: 255 }),
  body('fileSize')
    .isInt({ min: 1 })
    .withMessage('File size is required')
    .toInt(),
  body('area')
    .optional()
    .isIn(['vault', 'tasks', 'clients'])
    .withMessage('Unknown upload area'),
];

const documentIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid document id').toInt(),
];

const uploadDocumentValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Document title is required'),
  // Either storageKey (file stored in R2) or fileUrl (an outside link) is required; the service checks which.
  body('storageKey')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 512 }),
  body('fileUrl')
    .optional({ nullable: true })
    .trim(),
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
  uploadUrlValidation,
  uploadDocumentValidation,
  documentIdValidation,
};
