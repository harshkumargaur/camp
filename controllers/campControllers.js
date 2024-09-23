const campModel = require('../models/Camp');
const User = require('../models/User');
const Booking = require('../models/Booking');

//utils
const paginationUtilty = require('.././utils/paginationHelper');

const pagination = async (pageNo, res, next) => {
  const camps = await paginationUtilty(campModel, pageNo);

  if (camps.length === 0) {
    return res.json({
      status: 200,
      message: 'please add a new camp',
    });
  }

  if (!camps) {
    return next(new Error('camp not found'));
  }

  return res.json({
    status: 200,
    camps,
  });
};

const postCamp = async (req, res, next) => {
  const newCamp = campModel({
    name: req.body.name,
    price: req.body.price,
    about: req.body.about,
  });
  if (await campModel.create(newCamp)) {
    return res.sendStatus(200);
  } else {
    return next(new Error('camp not created'));
  }
};

const getCampById = async (req, res, next) => {
  // console.log('get camp by id');

  const { campId } = req.params;
  const camp = await campModel.findById(campId);

  if (camp) {
    return res.json({
      status: 200,
      camp,
    });
  } else {
    return next(new Error('camp not found'));
  }
};

const updateCamp = async (req, res, next) => {
  const { campId } = req.params;
  const { name, price, about } = req.body;
  const update = await campModel.findByIdAndUpdate(campId, {
    name,
    price,
    about,
  });
  if (!update) {
    return next(new Error('camp not updated'));
  }

  return res.sendStatus(200);
};

const deleteCamp = async (req, res, next) => {
  const { campId } = req.params;
  const del = await campModel.findByIdAndDelete(campId);
  if (!del) {
    return next(new Error('camp not deleted'));
  }
  return res.sendStatus(200);
};

const campFileUpload = async (req, res, next) => {
  // console.log(req.file);

  if (!req.file) {
    return next(new Error('please provide file'));
  }
  const pathFile = `${req.file.destination}${req.file.filename}`;

  const { campId } = req.params;
  const camp = await campModel.findById(campId);

  if (camp) {
    camp.images.push(pathFile);
    await camp.save();
    return res.sendStatus(200);
  } else {
    return next(new Error('camp not found'));
  }
};

const userBookCamp = async (req, res, next) => {
  console.log('user book camp');
  const { campId } = req.params;
  const userId = req.user;
  const { numDays } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return next(new Error('user not found'));
  }
  const camp = await campModel.findById(campId);
  if (!camp) {
    return next(new Error('camp not found'));
  }

  const bookingPrice = camp.price * numDays;
  const localtimeStamp = new Date().toLocaleString();
  const newBooking = await Booking.create({
    user: userId,
    camp: campId,
    bookingPrice: bookingPrice,
    localtimeStamp: localtimeStamp,
    numDays: numDays,
  });

  if (!newBooking) {
    return next(new Error('cannot create booking'));
  }

  res.sendStatus(200);
};

module.exports = {
  pagination,
  postCamp,
  getCampById,
  updateCamp,
  deleteCamp,
  campFileUpload,
  userBookCamp,
};
