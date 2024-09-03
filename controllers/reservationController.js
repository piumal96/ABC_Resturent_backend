const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment');
// Create a Reservation (Customer)
// Create a Reservation (Customer)
exports.createReservation = async (req, res) => {
  const { restaurant, service, date, time, type, deliveryAddress, specialRequests } = req.body;
  const customerId = req.session.user._id;  // Use session data

  try {
    // Step 1: Create a new Payment object with status 'Pending'
    const payment = new Payment({
      customer: customerId,
      amount: 0,  // Set to 0 initially, update later if needed
      status: 'Pending',
    });

    await payment.save();

    // Step 2: Create the reservation with the payment reference
    const reservation = new Reservation({
      customer: customerId,
      restaurant,
      service,
      date,
      time,
      type,
      deliveryAddress: type === 'Delivery' ? deliveryAddress : null,
      specialRequests,
      status: 'Pending',
      paymentStatus: 'Pending',
      payment: payment._id, // Link the newly created payment
    });

    await reservation.save();

    // Step 3: Update the Payment object with the Reservation ID
    payment.reservation = reservation._id;
    await payment.save();

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
        specialRequests: reservation.specialRequests,
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
        payment: {
          id: payment._id,
          amount: payment.amount,
          status: payment.status,
          paymentDate: payment.paymentDate
        },
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
      .populate('service')
      .populate('payment');  // Populate payment details

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
      .populate('service')
      .populate('payment');  // Populate payment details

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
exports.updateReservation = async (req, res) => {
  const { status, date, time, type, deliveryAddress, specialRequests, paymentId } = req.body;

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

    if (status) reservation.status = status;
    if (date) reservation.date = date;
    if (time) reservation.time = time;
    if (type) reservation.type = type;
    if (deliveryAddress && type === 'Delivery') reservation.deliveryAddress = deliveryAddress;
    if (specialRequests) reservation.specialRequests = specialRequests;
    if (paymentId) reservation.payment = paymentId;  

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
