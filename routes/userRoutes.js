const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/roleMiddleware');
const UserController = require('../controllers/userController');
// Public route - Register a new user
router.post('/register', UserController.registerUser);

// Admin routes - Only accessible by Admin
router.get('/', ensureAdmin, UserController.getAllUsers);
router.get('/:id', ensureAdmin, UserController.getUserById);
router.put('/:id', ensureAdmin, UserController.updateUser);
router.delete('/:id', ensureAdmin, UserController.deleteUser);

module.exports = router;
