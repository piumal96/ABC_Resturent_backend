const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Restaurant = require('../models/Restaurant');

// Create order and process payment for customers
exports.createOrderAndProcessPayment = async (req, res) => {
  const { restaurantId, deliveryAddress } = req.body;  // Accept restaurant ID and address from request
  const customerId = req.session.user._id;

  try {
    // Validate the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, msg: 'Restaurant not found' });
    }

    // Get the user's cart
    const cart = await Cart.findOne({ customer: customerId }).populate('items.dish');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    // Ensure delivery address is provided
    if (!deliveryAddress || deliveryAddress.trim() === '') {
      return res.status(400).json({ msg: 'Delivery address is required' });
    }

    // Create the order
    const order = new Order({
      customer: customerId,
      items: cart.items,
      restaurant: restaurantId,
      totalPrice: cart.totalPrice,
      deliveryAddress,  // Include user's address in the order
    });

    // Simulate payment process (replace with actual payment gateway logic)
    const paymentSuccess = true;  // Simulate payment success for now

    if (paymentSuccess) {
      order.paymentStatus = 'Paid';
      await order.save();

      // Clear the user's cart
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();

      return res.status(200).json({ success: true, msg: 'Payment successful', order });
    } else {
      order.paymentStatus = 'Failed';
      await order.save();
      return res.status(400).json({ success: false, msg: 'Payment failed' });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Get all orders for Admin/Staff
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer items.dish restaurant');
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Get orders for a specific customer
exports.getCustomerOrders = async (req, res) => {
    const customerId = req.session.user._id;
  
    try {
      const orders = await Order.find({ customer: customerId }).populate('items.dish restaurant');
      if (!orders || orders.length === 0) {
        return res.status(404).json({ success: false, msg: 'No orders found' });
      }
  
      return res.status(200).json({ success: true, orders });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success: false, msg: 'Server error' });
    }
  };

// Update order status (Admin/Staff only)
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, msg: 'Order not found' });
    }

    // Valid order statuses
    const validStatuses = ['Pending', 'Confirmed', 'Delivering', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, msg: 'Invalid status' });
    }

    // Update order status
    order.orderStatus = status;
    await order.save();

    return res.status(200).json({ success: true, msg: 'Order status updated', order });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Get payment report for Admin
exports.getPaymentReport = async (req, res) => {
    try {
      // Fetch all orders with payment status 'Paid'
      const paidOrders = await Order.find({ paymentStatus: 'Paid' });
  
      if (!paidOrders || paidOrders.length === 0) {
        return res.status(404).json({ success: false, msg: 'No paid orders found' });
      }
  
      // Calculate the total sales and the number of paid orders
      const totalSales = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);
      const totalOrders = paidOrders.length;
  
      // Return the summary to the admin
      return res.status(200).json({
        success: true,
        report: {
          totalSales,
          totalOrders,
          paidOrders,
        },
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success: false, msg: 'Server error' });
    }
  };
  