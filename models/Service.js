// models/Service.js

const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
