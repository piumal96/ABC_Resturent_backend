const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/reservationController');
const { ensureAuthenticated, ensureAdmin, ensureStaffOrAdmin } = require('../middlewares/roleMiddleware');

// Public route (Customer) - Create a Reservation
router.post('/', ensureAuthenticated, ReservationController.createReservation);

// Staff/Admin route - Get All Reservations
router.get('/', ensureAuthenticated, ensureStaffOrAdmin, ReservationController.getAllReservations);

// Customer route - Get Reservations by User
router.get('/user/:userId', ensureAuthenticated, ReservationController.getReservationsByUser);

// Customer/Staff route - Update a Reservation
router.put('/:id', ensureAuthenticated, ReservationController.updateReservation);

// Customer/Staff route - Delete a Reservation
router.delete('/:id', ensureAuthenticated, ReservationController.deleteReservation);

module.exports = router;
