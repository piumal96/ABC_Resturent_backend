const Restaurant = require('../models/Restaurant');

// @desc Add a new restaurant
// @route POST /api/restaurants
// @access Admin
exports.addRestaurant = async (req, res) => {
  const { name, location, address, phone, description, facilities, images } = req.body;

  if (!name, !location, !address, !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  try {
    const newRestaurant = new Restaurant({
      name,
      location,
      address,
      phone,
      description,
      facilities,
      images,
    });

    await newRestaurant.save();
    res.status(201).json({
      success: true,
      message: 'Restaurant added successfully',
      restaurant: newRestaurant,
    });
  } catch (err) {
    console.error('Error adding restaurant:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc Get all restaurants
// @route GET /api/restaurants
// @access Public
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({
      success: true,
      message: 'Restaurants fetched successfully',
      restaurants,
    });
  } catch (err) {
    console.error('Error fetching restaurants:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc Update restaurant details
// @route PUT /api/restaurants/:id
// @access Admin
exports.updateRestaurant = async (req, res) => {
  const { name, location, address, phone, description, facilities, images } = req.body;

  try {
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    restaurant.name = name || restaurant.name;
    restaurant.location = location || restaurant.location;
    restaurant.address = address || restaurant.address;
    restaurant.phone = phone || restaurant.phone;
    restaurant.description = description || restaurant.description;
    restaurant.facilities = facilities || restaurant.facilities;
    restaurant.images = images || restaurant.images;

    await restaurant.save();
    res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      restaurant,
    });
  } catch (err) {
    console.error('Error updating restaurant:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc Delete a restaurant
// @route DELETE /api/restaurants/:id
// @access Admin
exports.deleteRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    await restaurant.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Restaurant removed successfully',
    });
  } catch (err) {
    console.error('Error deleting restaurant:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
