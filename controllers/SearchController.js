const Service = require('../models/Service');
const Reservation = require('../models/Reservation');

// Search for Services
exports.searchServices = async (req, res) => {
  const { query } = req.query;

  try {
    const services = await Service.find({
      name: { $regex: query, $options: 'i' }  // Case-insensitive search
    });

    res.status(200).json({
      success: true,
      message: 'Services fetched successfully',
      services,
    });
  } catch (err) {
    console.error('Error searching services:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Check Service Availability
exports.checkServiceAvailability = async (req, res) => {
  const { serviceId, date, time } = req.query;

  try {
    const reservations = await Reservation.find({
      service: serviceId,
      date: new Date(date),
      time: time
    });

    const isAvailable = reservations.length === 0;

    res.status(200).json({
      success: true,
      message: 'Service availability checked successfully',
      available: isAvailable,
    });
  } catch (err) {
    console.error('Error checking service availability:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
