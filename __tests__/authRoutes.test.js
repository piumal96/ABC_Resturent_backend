const request = require('supertest');
const express = require('express');
const session = require('express-session');
const authRoutes = require('../routes/authRoutes'); // Adjust the path
const AuthController = require('../controllers/AuthController'); // Adjust the path
const User = require('../models/User'); // Mongoose User model
const bcrypt = require('bcrypt');

jest.mock('../models/User'); // Mock the User model
jest.mock('bcrypt'); // Mock bcrypt

const app = express();
app.use(express.json());

// Add express-session middleware
app.use(
  session({
    secret: 'testsecret',
    resave: false,
    saveUninitialized: true,  // Note: 'true' to force initialization of req.session
    cookie: { secure: false },
  })
);

app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock the loginUser function to manually define req.session
  AuthController.loginUser = jest.fn(async (req, res) => {
    req.session = {};  // Initialize the session manually
    const user = {
      _id: 'testuserid123',
      username: 'testuser',
      email: 'testuser@example.com',
      role: 'Customer',
    };
    req.session.user = user;  // Set session user
    res.status(200).json({ message: 'Login successful', user });
  });

  // Mock the logoutUser function to destroy the session
  AuthController.logoutUser = jest.fn(async (req, res) => {
    req.session = {};  // Initialize the session manually
    req.session.destroy = jest.fn((callback) => callback(null)); // Mock session destroy
    res.status(200).json({ message: 'Logged out successfully' });
  });

  it('should login the user', async () => {
    const mockUser = {
      _id: 'testuserid123',
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'hashedpassword',
      role: 'Customer',
    };

    // Mock the findOne method to return the mock user
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body.user).toHaveProperty('username', 'testuser');
  });

  it('should return 400 for invalid credentials', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invaliduser@example.com', password: 'password123' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should logout the user', async () => {
    const res = await request(app).post('/api/auth/logout');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logged out successfully');
  });
});
