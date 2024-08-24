// controllers/ReservationController.js

const Reservation = require('../models/Reservation');

// Create a Reservation (Customer)
exports.createReservation = async (req, res) => {
  const { restaurant, service, date, time, type, deliveryAddress, specialRequests } = req.body;
  const customerId = req.session.user._id;  // Use session data

  try {
    const reservation = new Reservation({
      customer: customerId,
      restaurant,
      service,
      date,
      time,
      type,
      deliveryAddress: type === 'Delivery' ? deliveryAddress : null, // Only set deliveryAddress if type is Delivery
      specialRequests
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    console.error('Error creating reservation:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get All Reservations (Staff and Admin only)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('customer')
      .populate('restaurant')
      .populate('service');
    res.status(200).json(reservations);
  } catch (err) {
    console.error('Error fetching reservations:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Reservations by User (Customer)
exports.getReservationsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const reservations = await Reservation.find({ customer: userId })
      .populate('restaurant')
      .populate('service');
    res.status(200).json(reservations);
  } catch (err) {
    console.error('Error fetching reservations by user:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a Reservation (Customer/Staff)
exports.updateReservation = async (req, res) => {
  const { status, date, time, type, deliveryAddress, specialRequests } = req.body;

  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    // Check if the user is allowed to update the reservation
    if (
      req.session.user.role !== 'Admin' &&
      req.session.user.role !== 'Staff' &&
      req.session.user._id !== reservation.customer.toString()
    ) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    if (status) reservation.status = status;
    if (date) reservation.date = date;
    if (time) reservation.time = time;
    if (type) reservation.type = type;
    if (deliveryAddress && type === 'Delivery') reservation.deliveryAddress = deliveryAddress;
    if (specialRequests) reservation.specialRequests = specialRequests;

    await reservation.save();
    res.status(200).json(reservation);
  } catch (err) {
    console.error('Error updating reservation:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a Reservation (Customer/Staff)
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    // Check if the user is allowed to delete the reservation
    if (
      req.session.user.role !== 'Admin' &&
      req.session.user.role !== 'Staff' &&
      req.session.user._id !== reservation.customer.toString()
    ) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    await reservation.deleteOne();
    res.status(200).json({ msg: 'Reservation deleted successfully' });
  } catch (err) {
    console.error('Error deleting reservation:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
