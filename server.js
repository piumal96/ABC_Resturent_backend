const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User'); 
const connectDB = require('./config/db');  


const app = express();

// Init Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Route to Create a New User
app.post('/api/users', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const user = new User({
      username,
      email,
      password, // This will be hashed by the pre-save hook in the User model
      role: role || 'Customer',
    });

    await user.save();

    // Send back the created user object
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// API Route for User Login
app.post('/api/auth', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // If matched, send back the user object (without the password)
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Default route
app.get('/', (req, res) => res.status(404).send({ msg: 'Hello' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
