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
  category: {
    type: String,
  },
  available_at: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  }],
});

module.exports = mongoose.model('Service', ServiceSchema);
