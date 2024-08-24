// routes/reports.js

const express = require('express');
const router = express.Router();
const ReportsController = require('../controllers/ReportsController');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/roleMiddleware');

// Admin routes - Get Reports
router.get('/reservations', ensureAuthenticated, ensureAdmin, ReportsController.getReservationReport);
router.get('/payments', ensureAuthenticated, ensureAdmin, ReportsController.getPaymentReport);
router.get('/queries', ensureAuthenticated, ensureAdmin, ReportsController.getQueryReport);
router.get('/users', ensureAuthenticated, ensureAdmin, ReportsController.getUserActivityReport);

module.exports = router;
