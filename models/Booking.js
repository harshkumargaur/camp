const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema(
  {
    user: {
      required: true,
      type: mongoose.ObjectId,
      ref: 'User',
    },
    camp: {
      required: true,
      type: mongoose.ObjectId,
      ref: 'Camp',
    },
    bookingPrice: {
      required: true,
      type: Number,
    },
    isPaid: {
      default: false,
      type: Boolean,
    },
    isVerified: {
      default: false,
      type: Boolean,
    },
    localtimeStamp: String,
    numDays: {
      required: true,
      type: Number,
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
