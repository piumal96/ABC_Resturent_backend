const mongoose = require('mongoose');
const Service = require('./Service'); // Import the Service model

const ReservationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // Reference the Service model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Dine-in', 'Delivery'],
    required: true,
  },
  deliveryAddress: {
    type: String,
   
    default: null,  // Default to null when not required
  },
  contactNumber: {
    type: String,

    default: null,  // Default to null when not required
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  specialRequests: {
    type: String,
    default: '',  // Default to an empty string if no special requests are provided
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;
