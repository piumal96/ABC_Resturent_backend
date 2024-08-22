const express = require('express');
const { createUser } = require('../services/userService');
const router = express.Router();

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post('/', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const user = await createUser(username, email, password, role);
    if (user.error) {
      return res.status(400).json({ msg: user.error });
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
