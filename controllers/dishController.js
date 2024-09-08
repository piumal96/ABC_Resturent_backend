const Dish = require('../models/Dish');

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.status(200).json({ success: true, dishes });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a single dish by ID
exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    res.status(200).json({ success: true, dish });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create a new dish (Admin only)
exports.createDish = async (req, res) => {
  const { name, description, price, category, customizations, imageUrl } = req.body;
  try {
    const newDish = new Dish({
      name,
      description,
      price,
      category,
      customizations,
      imageUrl,
    });
    await newDish.save();
    res.status(201).json({ success: true, dish: newDish });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a dish (Admin only)
exports.updateDish = async (req, res) => {
  try {
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    res.status(200).json({ success: true, dish: updatedDish });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a dish (Admin only)
exports.deleteDish = async (req, res) => {
  try {
    const deletedDish = await Dish.findByIdAndDelete(req.params.id);
    if (!deletedDish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    res.status(200).json({ success: true, message: 'Dish deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
