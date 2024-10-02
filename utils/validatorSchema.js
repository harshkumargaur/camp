const { validationResult } = require('express-validator');

const pageNoSchema = {
  pageNo: { isInt: true },
};

const campBodySchema = {
  name: {
    isEmpty: { negated: true },
    // notEmpty: true,
    escape: true,
    errorMessage: 'name cannot be empty',
  },
  price: {
    isInt: true,
    notEmpty: true,
    escape: true,
    errorMessage: 'price cannot be empty',
  },
  about: {
    notEmpty: true,
    escape: true,
    errorMessage: 'empty about',
  },
};

const mongoIdSchema = {
  campId: { isMongoId: true, errorMessage: 'not a valid ID' },
};

const validatorErrors = (req) => {
  const result = validationResult(req);
  const errors = result.formatWith((error) => error.msg).array();
  return errors;
};

const numDaysSchema = {
  numDays: {
    isNumeric: true,
    isEmpty: { negated: true },
    errorMessage: 'days should be number',
  },
};

module.exports = {
  pageNoSchema,
  campBodySchema,
  mongoIdSchema,
  numDaysSchema,
  validatorErrors,
};
