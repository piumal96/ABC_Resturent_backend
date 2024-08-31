const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment');
const Query = require('../models/Query');
const User = require('../models/User');

// Get Reservation Reports (Admin Only) with optional Pagination
exports.getReservationReport = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Pagination parameters

  try {
    const reservations = await Reservation.find()
      .populate('customer', 'name email')
      .populate('restaurant', 'name')
      .populate('service', 'name')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total number of reservations
    const count = await Reservation.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Reservation report fetched successfully',
      reservations,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Error fetching reservation report:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Payment Reports (Admin Only) with optional Pagination
exports.getPaymentReport = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Pagination parameters

  try {
    const payments = await Payment.find()
      .populate('customer', 'name email')
      .populate('reservation', 'date time restaurant')
      .sort({ paymentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total number of payments
    const count = await Payment.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Payment report fetched successfully',
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Error fetching payment report:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Query Reports (Admin Only) with optional Pagination
exports.getQueryReport = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Pagination parameters

  try {
    const queries = await Query.find()
      .populate('customer', 'name email')
      .populate('respondedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total number of queries
    const count = await Query.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Query report fetched successfully',
      queries,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Error fetching query report:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get User Activity Reports (Admin Only) with optional Pagination
exports.getUserActivityReport = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Pagination parameters

  try {
    const users = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total number of users
    const count = await User.countDocuments();

    res.status(200).json({
      success: true,
      message: 'User activity report fetched successfully',
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Error fetching user activity report:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
