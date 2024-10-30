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
      unique: true,
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
