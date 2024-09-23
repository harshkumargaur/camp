const jwt = require('jsonwebtoken');

const jwtTokenGen = async (data) => {
  return (token = jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  }));
};

const jwtDecode = async (token) => {
  const { data } = jwt.verify(token, process.env.JWT_SECRET);
  return data;
};

module.exports = {
  jwtTokenGen,
  jwtDecode,
};
