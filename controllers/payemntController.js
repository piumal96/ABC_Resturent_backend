const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');

exports.createPayment = async (req, res) => {
  const { reservationId, amount, paymentMethod } = req.body;
  const customerId = req.session.user._id;  // Use session data to get the customer ID

  try {
    // Step 1: Find the reservation by ID
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Step 2: Create a new Payment object
    const payment = new Payment({
      customer: customerId,
      reservation: reservationId,
      amount: amount || 0,  // Use provided amount or default to 0
      status: 'Pending',    // Payment status starts as 'Pending'
      paymentMethod: paymentMethod || 'credit-card', // Default to 'credit-card' if no method provided
    });

    // Step 3: Save the Payment object to the database
    await payment.save();

    // Step 4: Update the reservation with the payment ID and update payment status
    reservation.payment = payment._id;
    reservation.paymentStatus = 'Pending';  // Set initial payment status
    await reservation.save();

    // Step 5: Send the response back to the client with the payment details
    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      payment: {
        id: payment._id,
        customer: payment.customer,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate,
        reservation: payment.reservation,
      }
    });
  } catch (err) {
    console.error('Error creating payment:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Payments (Admin Only)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('customer', 'name email')
      .populate('reservation', 'date time restaurant')
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      message: 'Payments fetched successfully',
      payments,
    });
  } catch (err) {
    console.error('Error fetching payments:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Payments by User (Customer)
exports.getPaymentsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const payments = await Payment.find({ customer: userId })
      .populate('reservation', 'date time restaurant')
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      message: 'Payments fetched successfully',
      payments,
    });
  } catch (err) {
    console.error('Error fetching payments by user:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Payment Details and Status (Admin Only or Customers: Can only update their own payments.)
exports.updatePayment = async (req, res) => {
  const { amount, paymentMethod, paymentStatus } = req.body;
  const paymentId = req.params.id;
  const userId = req.session.user._id; 
  const userRole = req.session.user.role; 

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (userRole !== 'Admin' && userRole !== 'Customer') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this payment' });
    }

    if (userRole === 'Customer' && payment.customer.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this payment' });
    }

    if (amount !== undefined) payment.amount = amount;
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    if (paymentStatus) payment.status = paymentStatus;

    await payment.save();

    // If the payment status is updated, update the linked reservation status as well
    if (paymentStatus) {
      const reservation = await Reservation.findById(payment.reservation);
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      reservation.paymentStatus = paymentStatus;
      reservation.status = paymentStatus === 'Paid' ? 'Confirmed' : reservation.status;
      await reservation.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      payment,
    });
  } catch (err) {
    console.error('Error updating payment:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete a Payment (Admin Only)
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    await payment.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting payment:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
