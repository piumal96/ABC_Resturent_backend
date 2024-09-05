const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register a new user (Admin, Staff, or Customer)
exports.registerUserAdmin = async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log('Received registration request:', { username, email, role });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword, // Store the hashed password
      role: role || 'Customer',
    });

    await user.save();
    console.log('User created:', user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Register a new user (Admin, Staff, or Customer)
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log('Received registration request:', { username, email, role });

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          console.log('User already exists:', email);
          return res.status(400).json({
              success: false,
              message: 'User already exists',
          });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
          username,
          email,
          password: hashedPassword, // Store the hashed password
          role: role || 'Customer',
      });

      await user.save();
      console.log('User created:', user);

      // Store user information in session after registration
      req.session.user = {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
      };

      res.status(201).json({
          success: true,
          message: 'User registered successfully',
          user: {
              id: user._id,
              username: user.username,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
          },
          sessionId: req.sessionID,  // Include session ID in the response
      });
  } catch (err) {
      console.error('Error creating user:', err.message);
      res.status(500).json({
          success: false,
          message: 'Server error',
      });
  }
};
// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  console.log('Fetching all users...');
  try {
    const users = await User.find();
    console.log('Users fetched:', users);
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      users, // Returning the list of users
    });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get a single user by ID (Admin only)
exports.getUserById = async (req, res) => {
  console.log('Fetching user by ID:', req.params.id);
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log('User not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    console.log('User found:', user);
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      user,
    });
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update a user (Admin only)
exports.updateUser = async (req, res) => {
  console.log('Updating user:', req.params.id);
  console.log('Update data:', req.body);
  try {
    const { username, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      console.log('User not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    console.log('User updated:', user);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
  console.log('Attempting to delete user with ID:', req.params.id); // Logging the ID
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log('User not found:', req.params.id); // Logging if user is not found
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.deleteOne();
    console.log('User deleted successfully:', req.params.id); // Logging successful deletion
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting user:', err.message, err.stack); // Detailed error logging
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
