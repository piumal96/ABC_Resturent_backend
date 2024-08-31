// routes/search.js

const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/SearchController');

// Public route - Search for Services
router.get('/services', SearchController.searchServices);

// Public route - Check Service Availability
router.get('/availability', SearchController.checkServiceAvailability);

module.exports = router;
