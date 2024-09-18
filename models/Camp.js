const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
  name: String,
  price: Number,
  about: String,
  images: [String],
});
module.exports = mongoose.model('Camp', campSchema);
