const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Route for user login
router.post('/login', AuthController.loginUser);
router.post('/logout', AuthController.logoutUser);

module.exports = router;
