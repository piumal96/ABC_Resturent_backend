const Service = require('../models/Service');

// @desc Add a new service
exports.addService = async (req, res) => {
  const { name, description, price, category, available_at } = req.body;

  try {
    const newService = new Service({
      name,
      description,
      price,
      category,
      available_at
    });

    await newService.save();
    res.json(newService);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('available_at');
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Update a service
exports.updateService = async (req, res) => {
  const { service_id, name, description, price, category, available_at } = req.body;

  try {
    let service = await Service.findById(service_id);
    if (!service) {
      return res.status(400).json({ msg: 'Service not found' });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price || service.price;
    service.category = category || service.category;
    service.available_at = available_at || service.available_at;

    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Delete a service
exports.deleteService = async (req, res) => {
  const { service_id } = req.body;

  try {
    let service = await Service.findById(service_id);
    if (!service) {
      return res.status(400).json({ msg: 'Service not found' });
    }

    await service.remove();
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
