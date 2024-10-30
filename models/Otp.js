const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otp: {
    required: true,
    type: String,
  },
  phoneNo: {
    required: true,
    type: String,
  },
  expireAt: { type: Date, expires: 600, default: Date.now },
});

module.exports = mongoose.model('Otp', otpSchema);
