const express = require('express');
const connectDB = require('./config/db');  // Import the connectDB function
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// API Route to Create a New User
app.post('/api/users', async (req, res) => {
  const { username, email, password, role } = req.body;
  const client = await connectDB();  // Connect to the database and get the client

  if (!client) {
    return res.status(500).json({ msg: 'Failed to connect to database.' });
  }

  const db = client.db('abc-restaurant');

  try {
    const existingUser = await db.collection('users').findOne({ email });

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

    const userResult = await db.collection('users').insertOne(userToInsert);
    console.log('New User Created:', userResult);

    // Send back the created user object
    res.status(201).json({
      _id: userResult.insertedId,
      username: userToInsert.username,
      email: userToInsert.email,
      role: userToInsert.role,
      createdAt: userToInsert.createdAt
    });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ msg: 'Server error' });
  } finally {
    await client.close();  // Close the client connection after operations are complete
  }
});

// Default route
app.get('/', (req, res) => res.status(404).send({ msg: 'Hello' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
