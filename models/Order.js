const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Delivering', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  deliveryAddress: {
    type: String,  // Address can be a string, or you can create a separate schema if needed
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
