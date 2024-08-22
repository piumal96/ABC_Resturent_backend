const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middlewares/auth');

// @route   POST api/restaurants
// @desc    Add a new restaurant
// @access  Private/Admin
router.post('/', auth, restaurantController.addRestaurant);

// @route   GET api/restaurants
// @desc    Get all restaurants
// @access  Public
router.get('/', restaurantController.getAllRestaurants);

// @route   PUT api/restaurants
// @desc    Update a restaurant
// @access  Private/Admin
router.put('/', auth, restaurantController.updateRestaurant);

// @route   DELETE api/restaurants
// @desc    Delete a restaurant
// @access  Private/Admin
router.delete('/', auth, restaurantController.deleteRestaurant);

module.exports = router;
