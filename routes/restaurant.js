const express = require('express');
const router = express.Router();
const { addRestaurant, getAllRestaurants, updateRestaurant, deleteRestaurant } = require('../controllers/restaurantController');
const { ensureAdmin, ensureAuthenticated } = require('../middlewares/roleMiddleware');

// @route   POST /api/restaurants
// @desc    Add a new restaurant
// @access  Admin
router.post('/', ensureAdmin, addRestaurant);

// @route   GET /api/restaurants
// @desc    Get all restaurants
// @access  Public
router.get('/', getAllRestaurants);

// @route   PUT /api/restaurants/:id
// @desc    Update a restaurant
// @access  Admin
router.put('/:id', ensureAdmin, updateRestaurant);

// @route   DELETE /api/restaurants/:id
// @desc    Delete a restaurant
// @access  Admin
router.delete('/:id', ensureAdmin, deleteRestaurant);

module.exports = router;
