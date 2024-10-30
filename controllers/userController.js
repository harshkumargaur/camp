const crypto = require('crypto');
const bcrypt = require('bcrypt');

const User = require('./../models/User');
const Otp = require('./../models/Otp');

const { jwtTokenGen } = require('./../utils/jwtUtility');
const { validatorErrors } = require('./../utils/validatorSchema');

const userSignUp = async (req, res, next) => {
  const errorArr = validatorErrors(req);
  console.log(errorArr);

  if (errorArr.length !== 0) {
    return next(new Error(...[errorArr]));
  }
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const dateTimeLogin = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

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
  const errorArr = validatorErrors(req);
  console.log(errorArr);

  if (errorArr.length !== 0) {
    return next(new Error(...[errorArr]));
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

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
  const errorArr = validatorErrors(req);
  console.log(errorArr);

  if (errorArr.length !== 0) {
    return next(new Error(...[errorArr]));
  }
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
  const errorArr = validatorErrors(req);
  console.log(errorArr);

  if (errorArr.length !== 0) {
    return next(new Error(...[errorArr]));
  }
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

const userMobileOtpLogin = async (req, res, next) => {
  console.log('entered otp login');
  const errorArr = validatorErrors(req);
  console.log(errorArr);

  if (errorArr.length !== 0) {
    return next(new Error(...[errorArr]));
  }

  const otp = Math.trunc(Math.random() * 1000000);
  const hashedOtp = await bcrypt.hash(String(otp), 10);
  const { phoneNo } = req.body;

  const newOtp = new Otp({
    otp: hashedOtp,
    phoneNo: phoneNo,
  });
  await newOtp.save();
  res.status(200).json({
    otp: otp,
  });
};

const mobileOtpVerify = async (req, res, next) => {
  console.log('entered otp verify');
  const errorArr = validatorErrors(req);
  console.log(errorArr);

  if (errorArr.length !== 0) {
    return next(new Error(...[errorArr]));
  }

  const { phoneNo, otp } = req.body;
  const reqOtp = await Otp.findOne({
    phoneNo: phoneNo,
  });

  const otpMatched = await bcrypt.compare(otp, reqOtp.otp);

  if (!otpMatched) return next(new Error('otp not matched'));

  if (!reqOtp) return next(new Error('otp expired'));

  const user = await User.create({
    phone: phoneNo,
  });

  const token = await jwtTokenGen(user._id);
  res.status(200).json({
    token,
  });
};

module.exports = {
  userSignUp,
  userLogin,
  userForgotPassword,
  userResetPassword,
  userMobileOtpLogin,
  mobileOtpVerify,
};
