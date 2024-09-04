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
    console.log('User logged in:', user); // Print user login details
    res.status(200).json({ message: 'Login successful', user });
  });

  // Mock the logoutUser function to destroy the session
  AuthController.logoutUser = jest.fn(async (req, res) => {
    req.session = {};  // Initialize the session manually
    req.session.destroy = jest.fn((callback) => callback(null)); // Mock session destroy
    console.log('User logged out'); // Print logout message
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

    console.log('Starting login test for user:', mockUser.username); // Indicate test start

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' });

    // Print the result for better understanding
    console.log('Login response status:', res.statusCode);
    console.log('Login response body:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body.user).toHaveProperty('username', 'testuser');
    console.log('Login test completed successfully.');
  });

  it('should return 400 for invalid credentials', async () => {
    User.findOne.mockResolvedValue(null);

    console.log('Starting test for invalid login credentials');

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invaliduser@example.com', password: 'password123' });

    // Print the result for better understanding
    console.log('Invalid login response status:', res.statusCode);
    console.log('Invalid login response body:', res.body);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
    console.log('Invalid credentials test completed.');
  });

  it('should logout the user', async () => {
    console.log('Starting logout test');

    const res = await request(app).post('/api/auth/logout');

    // Print the result for better understanding
    console.log('Logout response status:', res.statusCode);
    console.log('Logout response body:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logged out successfully');
    console.log('Logout test completed successfully.');
  });
});
