// models/Offer.js

const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validTo: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Offer = mongoose.model('Offer', OfferSchema);

module.exports = Offer;
