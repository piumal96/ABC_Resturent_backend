const Cart = require('../models/Cart');
const Dish = require('../models/Dish');

// Add item to cart
exports.addItemToCart = async (req, res) => {
  const { dishId, quantity, customizations } = req.body;
  const customerId = req.session.user._id;

  try {
    // Validate quantity
    if (quantity <= 0 || isNaN(quantity)) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    // Find or create the cart
    let cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      cart = new Cart({ customer: customerId, items: [], totalPrice: 0 });
    }

    // Find the dish
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    // Validate dish price
    if (isNaN(dish.price) || dish.price <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid dish price' });
    }

    // Calculate the total price for the item
    let totalPrice = dish.price;
    if (customizations) {
      for (let key in customizations) {
        const customizationPrice = customizations[key];
        if (!isNaN(customizationPrice)) {
          totalPrice += customizationPrice;
        } else {
          return res.status(400).json({ success: false, message: `Invalid customization price for ${key}` });
        }
      }
    }

    // Ensure totalPrice is valid
    if (isNaN(totalPrice)) {
      return res.status(400).json({ success: false, message: 'Invalid total price calculation' });
    }

    // Add the item to the cart
    const itemTotalPrice = totalPrice * quantity;
    cart.items.push({
      dish: dishId,
      quantity,
      customizations,
      totalPrice: itemTotalPrice,
    });

    // Update the total cart price
    cart.totalPrice += itemTotalPrice;
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get the cart for a customer
exports.getCart = async (req, res) => {
  const customerId = req.session.user._id;

  try {
    const cart = await Cart.findOne({ customer: customerId }).populate('items.dish');
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res) => {
  const { dishId, quantity } = req.body;
  const customerId = req.session.user._id;

  try {
    // Validate quantity
    if (quantity <= 0 || isNaN(quantity)) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.dish.toString() === dishId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    // Calculate new total price for the item
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    const itemTotalPrice = dish.price * quantity;
    item.quantity = quantity;
    item.totalPrice = itemTotalPrice;

    // Update the total cart price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  const { dishId } = req.body;
  const customerId = req.session.user._id;

  try {
    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item.dish.toString() !== dishId);

    // Recalculate the total price of the cart
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
