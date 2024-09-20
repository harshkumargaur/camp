const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: String,
    },
    resetToken: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
