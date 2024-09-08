const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
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
    enum: ['Starter', 'Main Course', 'Dessert', 'Drinks'],
    required: true,
  },
  customizations: [
    {
      name: String,
      options: [String],  
      price: Number,  
    }
  ],
  imageUrl: {
    type: String,
  },
});

const Dish = mongoose.model('Dish', DishSchema);
module.exports = Dish;
