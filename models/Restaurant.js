const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'], // Example for Sri Lanka
  },
  description: {
    type: String,
    trim: true,
  },
  facilities: [{
    type: String,
    trim: true,
  }],
  images: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
