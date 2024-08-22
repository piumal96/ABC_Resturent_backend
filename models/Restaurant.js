const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  facilities: [{
    type: String,
  }],
  images: [{
    type: String,
  }],
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
