const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

// @desc Create a reservation
exports.createReservation = async (req, res) => {
  const { restaurant_id, service_id, date, time, type } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(400).json({ msg: 'Restaurant not found' });
    }

    const reservation = new Reservation({
      user_id: req.user.id,
      restaurant_id,
      service_id,
      date,
      time,
      type
    });

    await reservation.save();
    res.json({ reservation });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Get all reservations for a user
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user_id: req.user.id }).populate('restaurant_id service_id');
    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Update a reservation
exports.updateReservation = async (req, res) => {
  const { reservation_id, status } = req.body;

  try {
    let reservation = await Reservation.findById(reservation_id);
    if (!reservation) {
      return res.status(400).json({ msg: 'Reservation not found' });
    }

    reservation.status = status;
    await reservation.save();

    res.json(reservation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Delete a reservation
exports.deleteReservation = async (req, res) => {
  const { reservation_id } = req.body;

  try {
    let reservation = await Reservation.findById(reservation_id);
    if (!reservation) {
      return res.status(400).json({ msg: 'Reservation not found' });
    }

    await reservation.remove();
    res.json({ msg: 'Reservation removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
