const { body, query } = require('express-validator');

const checkInValidation = [
  body('lat')
    .optional({ nullable: true })
    .isFloat()
    .toFloat(),
  body('lng')
    .optional({ nullable: true })
    .isFloat()
    .toFloat(),
  body('location')
    .optional({ nullable: true })
    .trim(),
  body('notes')
    .optional({ nullable: true })
    .trim(),
];

const checkOutValidation = [
  body('lat')
    .optional({ nullable: true })
    .isFloat()
    .toFloat(),
  body('lng')
    .optional({ nullable: true })
    .isFloat()
    .toFloat(),
  body('location')
    .optional({ nullable: true })
    .trim(),
  body('notes')
    .optional({ nullable: true })
    .trim(),
];

module.exports = {
  checkInValidation,
  checkOutValidation,
};
