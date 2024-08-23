const bcrypt = require('bcrypt');
const User = require('../models/User');

const createUser = async (username, email, password, role = 'Customer') => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return { error: 'User already exists' };
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    return newUser;
  } catch (err) {
    console.error('Error during user creation:', err.message);
    throw err;
  }
};

module.exports = { createUser };
