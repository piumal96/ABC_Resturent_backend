// controllers/ServiceController.js

const Service = require('../models/Service');

// Create a new service
exports.createService = async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const service = new Service({ name, description, price });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    console.error('Error creating service:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    console.error('Error fetching services:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (err) {
    console.error('Error fetching service:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price || service.price;

    await service.save();
    res.status(200).json(service);
  } catch (err) {
    console.error('Error updating service:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    await service.deleteOne();
    res.status(200).json({ msg: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
