// routes/service.js

const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/serviceController');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/roleMiddleware');

// Public route - Get all services
router.get('/', ServiceController.getAllServices);

// Admin routes - Only accessible by Admin
router.post('/', ensureAuthenticated, ensureAdmin, ServiceController.createService);
router.get('/:id', ensureAuthenticated, ensureAdmin, ServiceController.getServiceById);
router.put('/:id', ensureAuthenticated, ensureAdmin, ServiceController.updateService);
router.delete('/:id', ensureAuthenticated, ensureAdmin, ServiceController.deleteService);

module.exports = router;
