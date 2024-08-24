// controllers/PaymentController.js

const Payment = require('../models/Payment');

// Create a Payment (Customer)
exports.createPayment = async (req, res) => {
  const { reservation, amount } = req.body;
  const customerId = req.session.user._id;  // Assuming session-based authentication

  try {
    const payment = new Payment({
      customer: customerId,
      reservation,
      amount,
      status: 'Pending', // Initial status can be 'Pending'
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    console.error('Error creating payment:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get All Payments (Admin Only)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('customer', 'name email')
      .populate('reservation', 'date time restaurant')
      .sort({ paymentDate: -1 });

    res.status(200).json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Payments by User (Customer)
exports.getPaymentsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const payments = await Payment.find({ customer: userId })
      .populate('reservation', 'date time restaurant')
      .sort({ paymentDate: -1 });

    res.status(200).json(payments);
  } catch (err) {
    console.error('Error fetching payments by user:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a Payment Status (Admin Only)
exports.updatePaymentStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }

    payment.status = status;
    await payment.save();

    res.status(200).json(payment);
  } catch (err) {
    console.error('Error updating payment status:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a Payment (Admin Only)
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }

    await payment.deleteOne();
    res.status(200).json({ msg: 'Payment deleted successfully' });
  } catch (err) {
    console.error('Error deleting payment:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
