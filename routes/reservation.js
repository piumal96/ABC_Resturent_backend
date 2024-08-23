const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middlewares/auth');

// @route   POST api/reservations
// @desc    Create a reservation
// @access  Private
router.post('/', auth, reservationController.createReservation);

// @route   GET api/reservations
// @desc    Get all reservations for a user
// @access  Private
router.get('/', auth, reservationController.getUserReservations);

// @route   PUT api/reservations
// @desc    Update a reservation
// @access  Private
router.put('/', auth, reservationController.updateReservation);

// @route   DELETE api/reservations
// @desc    Delete a reservation
// @access  Private
router.delete('/', auth, reservationController.deleteReservation);

module.exports = router;
