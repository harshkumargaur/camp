const axios = require('axios');
const Razorpay = require('razorpay');
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});
const Booking = require('./../models/Booking');

const getAllBookingsOfUser = async (req, res, next) => {
  console.log('entered get all bookings of a user');
  const userId = req.user;
  const bookings = await Booking.find({ user: userId })
    .populate('user', 'email')
    .populate('camp', { name: 1, price: 1 });
  if (!bookings || bookings.length === 0) {
    return next(new Error('no booking found'));
  }
  res.status(200).json({
    bookings,
  });
};

const createOrderForBokoingRazorpay = async (req, res, next) => {
  console.log('create order on razorpay');
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new Error('booking not found'));
  }
  const razorpayorder = await instance.orders.create({
    amount: booking.bookingPrice * 100,
    currency: 'INR',
    partial_payment: false,
    notes: {
      key1: 'value3',
      key2: 'value2',
    },
  });
  console.log(razorpayorder);
  booking.razorpayOrderId = razorpayorder.id;
  await booking.save();
  return res.status(200).json(razorpayorder);
  // console.log(data);
};

module.exports = {
  getAllBookingsOfUser,
  createOrderForBokoingRazorpay,
};
