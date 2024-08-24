const Restaurant = require('../models/Restaurant');

// @desc Add a new restaurant
// @route POST /api/restaurants
// @access Admin
exports.addRestaurant = async (req, res) => {
  const { name, location, address, phone, description, facilities, images } = req.body;

  if (!name || !location || !address || !phone) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    const newRestaurant = new Restaurant({
      name,
      location,
      address,
      phone,
      description,
      facilities,
      images
    });

    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Get all restaurants
// @route GET /api/restaurants
// @access Public
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
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
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    restaurant.name = name || restaurant.name;
    restaurant.location = location || restaurant.location;
    restaurant.address = address || restaurant.address;
    restaurant.phone = phone || restaurant.phone;
    restaurant.description = description || restaurant.description;
    restaurant.facilities = facilities || restaurant.facilities;
    restaurant.images = images || restaurant.images;

    await restaurant.save();
    res.status(200).json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Delete a restaurant
// @route DELETE /api/restaurants/:id
// @access Admin
exports.deleteRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    await restaurant.deleteOne();
    res.status(200).json({ msg: 'Restaurant removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
