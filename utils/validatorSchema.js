const { validationResult } = require('express-validator');
const User = require('./../models/User');

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

const numDaysSchema = {
  numDays: {
    isNumeric: true,
    isEmpty: { negated: true },
    errorMessage: 'days should be number',
  },
};

const userSignUpSchema = {
  email: {
    isEmail: true,
    notEmpty: true,
    custom: {
      options: async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error('user already exists');
        }
      },
    },
    errorMessage: 'Invalid Email',
  },
  password: {
    notEmpty: true,
    isStrongPassword: true,
    errorMessage: 'Password is weak or cannot be empty',
  },
};

const userLoginSchema = {
  email: {
    isEmail: true,
    notEmpty: true,
    custom: {
      options: async (value) => {
        const user = await User.findOne({ email: value });
        if (!user) {
          throw new Error('user does not exists');
        }
      },
    },
    errorMessage: 'Invalid Email',
  },
  password: {
    notEmpty: true,
    errorMessage: 'password cannot be empty',
  },
};

const userForgotPasswordSchema = {
  email: {
    notEmpty: true,
    isEmail: true,
    errorMessage: 'please provide a valid email',
  },
};

const userResetPasswordSchema = {
  resetToken: {
    notEmpty: true,
    errorMessage: 'reset token cannot be empty',
  },
  newPassword: {
    notEmpty: true,
    isStrongPassword: true,
    errorMessage: 'provide a strong password',
  },
};

const validatorErrors = (req) => {
  const result = validationResult(req);
  const errors = result.formatWith((error) => error.msg).array();
  return errors;
};

module.exports = {
  pageNoSchema,
  campBodySchema,
  mongoIdSchema,
  numDaysSchema,
  userSignUpSchema,
  userLoginSchema,
  userForgotPasswordSchema,
  userResetPasswordSchema,
  validatorErrors,
};
