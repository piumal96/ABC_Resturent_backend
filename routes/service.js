const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middlewares/auth');

// @route   POST api/services
// @desc    Add a new service
// @access  Private/Admin
router.post('/', auth, serviceController.addService);

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', serviceController.getAllServices);

// @route   PUT api/services
// @desc    Update a service
// @access  Private/Admin
router.put('/', auth, serviceController.updateService);

// @route   DELETE api/services
// @desc    Delete a service
// @access  Private/Admin
router.delete('/', auth, serviceController.deleteService);

module.exports = router;
