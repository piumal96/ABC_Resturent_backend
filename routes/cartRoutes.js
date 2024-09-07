const express = require('express');
const router = express.Router();
const { addItemToCart, getCart, updateCartItem, removeItemFromCart } = require('../controllers/cartController');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/roleMiddleware');

// Customer routes
router.post('/', ensureAuthenticated, addItemToCart);
router.get('/', ensureAuthenticated,getCart);
router.put('/', ensureAuthenticated,updateCartItem);
router.delete('/', ensureAuthenticated,removeItemFromCart);


module.exports = router;
