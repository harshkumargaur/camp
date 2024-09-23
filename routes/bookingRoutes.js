const express = require('express');
const router = express.Router();

const { userAuthMiddleware } = require('./../utils/authMiddlewareUtilitty');
const {
  getAllBookingsOfUser,
  createOrderForBokoingRazorpay,
} = require('./../controllers/bookingController');

router.get('/', userAuthMiddleware, async (req, res, next) => {
  await getAllBookingsOfUser(req, res, next);
});

router.post('/:bookingId/pay', userAuthMiddleware, async (req, res, next) => {
  await createOrderForBokoingRazorpay(req, res, next);
});

module.exports = router;
