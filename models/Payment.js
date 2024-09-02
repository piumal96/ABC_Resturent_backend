const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    // Remove `required: true` to allow the payment to be created before linking to a reservation
  },
  amount: {
    type: Number,
    required: true,
    default: 0,  // Set default amount to 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'cash', 'online'],
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
