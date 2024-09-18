require('@dot/env');
const process = require('process');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

////models

////controller

//Router
const campRouter = require('./routes/campRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/camp', campRouter);
app.use('/user', userRouter);
///ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(404).json({
    err: err.message,
  });
});

app.listen(process.env.PORT, async (err) => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('connected');
});

process.on('uncaughtException', (err, origin) => {
  console.error('entered');
  console.error(err);
  console.error(err.message);
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(0);
});
