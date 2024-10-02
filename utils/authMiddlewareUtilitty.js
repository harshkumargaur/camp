const User = require('./../models/User');
const { jwtDecode } = require('./jwtUtility');

const userAuthMiddleware = async (req, res, next) => {
  console.log('user auth middleware');

  if (!req.headers.authorization) {
    return next(new Error('please provide authorization header'));
  }
  const jwtToken = req.headers.authorization.split(' ')[1];

  const userId = await jwtDecode(jwtToken);
  console.log(userId);
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    return next(new Error('user not exists'));
  }
  req.user = userId;
  next();
};

module.exports = {
  userAuthMiddleware,
};
