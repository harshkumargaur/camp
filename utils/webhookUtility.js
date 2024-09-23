const crypto = require('crypto');

const Booking = require('./../models/Booking');

const paymentWebhook = async (req, res, next) => {
  console.log('enter payment webhook');
  const actualSign = req.headers['x-razorpay-signature'];

  const { payload } = req.body;

  const expectedSign = crypto.createHmac('sha256', 'VypE86rlrnXkHhfMxj55Uk0w');
  expectedSign.update(JSON.stringify(req.body));
  const digested = expectedSign.digest('hex');
  if (digested !== actualSign) {
    return next(new Error('signature not matched'));
  }

  const {
    payment: { entity },
  } = payload;
  // console.log(entity.id);
  // console.log(entity.order_id);
  // console.log(entity.captured);

  if (!entity.captured) {
    console.log('entered');

    return next(new Error('payment failed'));
  }

  const { order_id } = entity;
  const booking = await Booking.findOne({ razorpayOrderId: order_id });

  if (!booking) {
    return next(new Error('booking not found'));
  }
  booking.isPaid = true;
  booking.isVerified = true;
  booking.razorpayPaymentId = entity.id;
  await booking.save();

  // console.log(req.body.payload.order);

  return res.sendStatus(200);
};

module.exports = {
  paymentWebhook,
};

/* verify signature from frontend*/
/****************************************** *
const expectedSign = crypto.createHmac('sha256', 'VypE86rlrnXkHhfMxj55Uk0w');
expectedSign.update('order_P0ULRug4utXghe' + '|' + 'pay_P0UNARTTqB96uf');
const digested = expectedSign.digest('hex');
console.log(
  digested ===
    '104f3a875ebf286ce712d6c607508b724b3c60f1cd00029219b573e43301543f' // sign from frontend
);
//**************************************************/
