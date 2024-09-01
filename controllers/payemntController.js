const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');

// Create a Payment (Customer)
exports.createPayment = async (req, res) => {
  const { reservation, amount } = req.body;
  const customerId = req.session.user._id;

  try {
    // Create a new payment entry
    const payment = new Payment({
      customer: customerId,
      reservation,
      amount,
      status: 'Pending', // Initial status can be 'Pending'
    });

    await payment.save();

    // Update the reservation's paymentStatus and status
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservation,
      { paymentStatus: 'Paid', status: 'Confirmed' },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Payment created successfully and reservation confirmed',
      payment: {
        id: payment._id,
        customer: payment.customer,
        reservation: payment.reservation,
        amount: payment.amount,
        status: payment.status,
        paymentDate: payment.paymentDate,
      },
      reservation: {
        id: updatedReservation._id,
        status: updatedReservation.status,
        paymentStatus: updatedReservation.paymentStatus,
      },
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

// Update a Payment Status (Admin Only)
// Update a Payment Status (Admin Only)
exports.updatePaymentStatus = async (req, res) => {
  const { status } = req.body; // Get the status from the request body

  try {
    // Find the payment by its ID
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Update the payment status
    payment.status = status;
    await payment.save();

    // If the payment is marked as 'Paid', update the corresponding reservation status
    if (status === 'Paid') {
      const updatedReservation = await Reservation.findByIdAndUpdate(
        payment.reservation,
        { paymentStatus: 'Paid', status: 'Confirmed' },
        { new: true }
      );

      if (!updatedReservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Payment and reservation status updated successfully',
        payment,
        reservation: {
          id: updatedReservation._id,
          status: updatedReservation.status,
          paymentStatus: updatedReservation.paymentStatus,
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'Payment status updated successfully',
        payment,
      });
    }
  } catch (err) {
    console.error('Error updating payment status:', err.message);
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
