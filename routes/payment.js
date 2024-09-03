// routes/payment.js

const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payemntController');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/roleMiddleware');

// Customer route - Create a Payment
router.post('/', ensureAuthenticated, PaymentController.createPayment);

// Admin route - Get All Payments
router.get('/', ensureAuthenticated, ensureAdmin, PaymentController.getAllPayments);

// Customer route - Get Payments by User
router.get('/user/:userId', ensureAuthenticated, PaymentController.getPaymentsByUser);

// Admin route - Update Payment Status
router.put('/:id', ensureAuthenticated, PaymentController.updatePayment);

// Admin route - Delete a Payment
router.delete('/:id', ensureAuthenticated, ensureAdmin, PaymentController.deletePayment);

module.exports = router;
