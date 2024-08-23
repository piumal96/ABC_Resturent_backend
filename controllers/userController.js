const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const UserModel = require('../models/userModel');

exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  const client = await connectDB();

  if (!client) {
    return res.status(500).json({ msg: 'Failed to connect to database.' });
  }

  const db = client.db('abc-restaurant');
  const userModel = new UserModel(db);

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userToInsert = {
      username,
      email,
      password: hashedPassword,
      role: role || 'Customer',
      createdAt: new Date(),
    };

    const userResult = await userModel.insertOne(userToInsert);
    console.log('New User Created:', userResult);

    res.status(201).json({
      _id: userResult.insertedId,
      username: userToInsert.username,
      email: userToInsert.email,
      role: userToInsert.role,
      createdAt: userToInsert.createdAt,
    });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ msg: 'Server error' });
  } finally {
    await client.close();
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const client = await connectDB();

  if (!client) {
    return res.status(500).json({ msg: 'Failed to connect to database.' });
  }

  const db = client.db('abc-restaurant');
  const userModel = new UserModel(db);

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

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
  } finally {
    await client.close();
  }
};
