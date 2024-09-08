const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
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
        default: 1,
      },
      customizations: {
        type: Map,
        of: String,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
    }
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
