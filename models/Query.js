const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  response: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Answered'],
    default: 'Pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Query', QuerySchema);
