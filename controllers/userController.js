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

module.exports = { userSignUp, userLogin };
