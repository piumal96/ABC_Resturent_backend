const Restaurant = require('../models/Restaurant');

// @desc Add a new restaurant
exports.addRestaurant = async (req, res) => {
  const { name, location, address, phone, description, facilities, images } = req.body;

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
    res.json(newRestaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Update restaurant details
exports.updateRestaurant = async (req, res) => {
  const { restaurant_id, name, location, address, phone, description, facilities, images } = req.body;

  try {
    let restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(400).json({ msg: 'Restaurant not found' });
    }

    restaurant.name = name || restaurant.name;
    restaurant.location = location || restaurant.location;
    restaurant.address = address || restaurant.address;
    restaurant.phone = phone || restaurant.phone;
    restaurant.description = description || restaurant.description;
    restaurant.facilities = facilities || restaurant.facilities;
    restaurant.images = images || restaurant.images;

    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
  const { restaurant_id } = req.body;

  try {
    let restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(400).json({ msg: 'Restaurant not found' });
    }

    await restaurant.remove();
    res.json({ msg: 'Restaurant removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
