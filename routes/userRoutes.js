const express = require('express');
const router = express.Router();

const {
  userSignUp,
  userLogin,
  userForgotPassword,
  userResetPassword,
} = require('./../controllers/userController');

const {
  userSignUpSchema,
  userLoginSchema,
  userForgotPasswordSchema,
  userResetPasswordSchema,
} = require('./../utils/validatorSchema');
const { checkSchema } = require('express-validator');

router.post(
  '/signup',
  checkSchema(userSignUpSchema, ['body']),
  async (req, res, next) => {
    userSignUp(req, res, next);
  }
);

router.post(
  '/login',
  checkSchema(userLoginSchema, ['body']),
  async (req, res, next) => {
    userLogin(req, res, next);
  }
);

router.post(
  '/forgot-password',
  checkSchema(userForgotPasswordSchema, ['body']),
  async (req, res, next) => {
    console.log('entered');
    userForgotPassword(req, res, next);
  }
);

router.post(
  '/reset-password/:resetToken',
  checkSchema(userResetPasswordSchema, ['body', 'params']),
  async (req, res, next) => {
    console.log('entered');
    userResetPassword(req, res, next);
  }
);

// router.get('/', async (req, res, next) => {
//   console.log('entered');
// });

module.exports = router;
