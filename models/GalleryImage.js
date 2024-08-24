// models/GalleryImage.js

const mongoose = require('mongoose');

const GalleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const GalleryImage = mongoose.model('GalleryImage', GalleryImageSchema);

module.exports = GalleryImage;
