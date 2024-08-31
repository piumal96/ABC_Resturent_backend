const Reservation = require('../models/Reservation');

// Create a Reservation (Customer)
exports.createReservation = async (req, res) => {
  const { restaurant, service, date, time, type, deliveryAddress, contactNumber, specialRequests } = req.body;
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
      contactNumber: type === 'Delivery' ? contactNumber : null, // Only set contactNumber if type is Delivery
      specialRequests,
    });

    await reservation.save();
    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      reservation: {
        id: reservation._id,
        customer: reservation.customer,
        restaurant: reservation.restaurant,
        service: reservation.service,
        date: reservation.date,
        time: reservation.time,
        type: reservation.type,
        deliveryAddress: reservation.deliveryAddress,
        contactNumber: reservation.contactNumber,
        specialRequests: reservation.specialRequests,
        status: reservation.status,
        createdAt: reservation.createdAt,
      }
    });
  } catch (err) {
    console.error('Error creating reservation:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Reservations (Staff and Admin only)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('customer')
      .populate('restaurant')
      .populate('service');

    res.status(200).json({
      success: true,
      message: 'Reservations fetched successfully',
      reservations,
    });
  } catch (err) {
    console.error('Error fetching reservations:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Reservations by User (Customer)
exports.getReservationsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const reservations = await Reservation.find({ customer: userId })
      .populate('restaurant')
      .populate('service');

    res.status(200).json({
      success: true,
      message: 'Reservations fetched successfully',
      reservations,
    });
  } catch (err) {
    console.error('Error fetching reservations by user:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update a Reservation (Customer/Staff)
// Update a Reservation (Customer/Staff)
exports.updateReservation = async (req, res) => {
  const { status, date, time, type, deliveryAddress, contactNumber, specialRequests } = req.body;

  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // Check if the user is allowed to update the reservation
    if (
      req.session.user.role !== 'Admin' &&
      req.session.user.role !== 'Staff' &&
      req.session.user._id !== reservation.customer.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
    }

    // Update the reservation fields based on the request body
    if (status) reservation.status = status;
    if (date) reservation.date = date;
    if (time) reservation.time = time;
    if (type) reservation.type = type;

    // Handle delivery-specific fields
    if (type === 'Delivery') {
      if (deliveryAddress) reservation.deliveryAddress = deliveryAddress;
      if (contactNumber) reservation.contactNumber = contactNumber;
    } else {
      // Clear delivery-related fields if the type is not 'Delivery'
      reservation.deliveryAddress = null;
      reservation.contactNumber = null;
    }

    if (specialRequests) reservation.specialRequests = specialRequests;

    await reservation.save();
    res.status(200).json({
      success: true,
      message: 'Reservation updated successfully',
      reservation,
    });
  } catch (err) {
    console.error('Error updating reservation:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


// Delete a Reservation (Customer/Staff)
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // Check if the user is allowed to delete the reservation
    if (
      req.session.user.role !== 'Admin' &&
      req.session.user.role !== 'Staff' &&
      req.session.user._id !== reservation.customer.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
    }

    await reservation.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Reservation deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting reservation:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
