const jwt = require('jsonwebtoken');

const jwtTokenGen = async (data) => {
  return (token = jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  }));
};

module.exports = {
  jwtTokenGen,
};
