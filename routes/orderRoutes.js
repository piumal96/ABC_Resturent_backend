const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const { ensureAuthenticated, ensureStaffOrAdmin,ensureAdmin } = require('../middlewares/roleMiddleware');

// Customer routes
router.post('/payment', ensureAuthenticated, orderController.createOrderAndProcessPayment);  // Include restaurant and address in the request
router.get('/user/orders', ensureAuthenticated, orderController.getCustomerOrders);

// Admin or Staff routes
router.get('/orders', ensureStaffOrAdmin, orderController.getAllOrders);
router.put('/orders/status', ensureStaffOrAdmin, orderController.updateOrderStatus);
router.get('/orders/report', ensureAdmin, orderController.getPaymentReport);

module.exports = router;
