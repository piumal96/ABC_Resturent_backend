const express = require('express');
const router = express.Router();
const { getAllDishes, getDishById, createDish, updateDish, deleteDish } = require('../controllers/dishController');

// Public routes
router.get('/', getAllDishes);
router.get('/:id', getDishById);

// Admin-only routes
router.post('/', createDish); 
router.put('/:id', updateDish);
router.delete('/:id', deleteDish);

module.exports = router;
