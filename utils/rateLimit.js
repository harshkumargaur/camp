const { rateLimit } = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'please try after sometime rate limit exceeded',
  store: new MongoStore({
    uri: process.env.MONGO_URL,
    expireTimeMs: 15 * 60 * 1000,
    errorHandler: console.error.bind(null, 'rate-limit-mongo'),
  }),
});
module.exports = {
  limiter,
};
