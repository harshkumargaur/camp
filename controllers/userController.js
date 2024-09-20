const crypto = require('crypto');

const User = require('./../models/User');
const bcrypt = require('bcrypt');

const { jwtTokenGen } = require('./../utils/jwtUtility');

const userSignUp = async (req, res, next) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findOne({ email: email });

  const dateTimeLogin = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

  if (user) {
    return next(new Error('please login you have already signed up'));
  }
  const newUser = await User.create({
    email: email,
    password: hashedPassword,
    lastLogin: dateTimeLogin,
  });

  if (!newUser) {
    return next(new Error('cannot sign up'));
  }
  const token = await jwtTokenGen(newUser._id);
  return res.status(200).json({
    token,
  });
};

const userLogin = async (req, res, next) => {
  console.log('entered login');
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new Error('user not exists'));
  }

  const hashedPasswordMatch = await bcrypt.compare(password, user.password);
  if (!hashedPasswordMatch) {
    return next(new Error('password not match'));
  }

  const dateTimeLogin = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

  await User.findByIdAndUpdate(user._id, { lastLogin: dateTimeLogin });

  const token = await jwtTokenGen(user._id);
  return res.status(200).json({
    token,
  });
};

const userForgotPassword = async (req, res, next) => {
  console.log('user forgot password');
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new Error('user not exist so password cannot be reseted'));
  }
  const token = crypto.randomBytes(25).toString('hex');
  await User.findOneAndUpdate({ email: email }, { resetToken: token });
  res.status(200).json({
    resetLink: `${process.env.NGROK_DOMAIN}/user/reset-password/${token}`,
    resetToken: token,
  });
};

const userResetPassword = async (req, res, next) => {
  console.log('user reset password');
  const { resetToken } = req.params;
  const { newPassword } = req.body;
  const user = await User.findOne({ resetToken: resetToken });
  if (!user) {
    return next(new Error('user not exist so password cannot be reseted'));
  }
  // const token = crypto.randomBytes(25).toString('hex');
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = '';
  await user.save();
  res.sendStatus(200);
};

module.exports = {
  userSignUp,
  userLogin,
  userForgotPassword,
  userResetPassword,
};
