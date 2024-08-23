const request = require('supertest');
const server = require('../server'); // Import the server, not just the app
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Connect to a test database before running tests
beforeAll(async () => {
  const url = process.env.MONGO_URI;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clean up the test database after each test
afterEach(async () => {
  await User.deleteMany({});
});

// Close the connection to the test database after all tests are done
afterAll(async () => {
  await mongoose.connection.close();
  await server.close();  // Ensure the server is closed after tests
});

describe('UserController - User Registration, Update, and Deletion', () => {
  
  // Test for user registration
  it('should register a new user', async () => {
    const res = await request(server)  // Use the server instance
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'Customer'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('email', 'testuser@example.com');
  });

  // Test for duplicate user registration
  it('should not register a user with an existing email', async () => {
    const user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: await bcrypt.hash('password123', 10), // Ensure password is hashed
      role: 'Customer'
    });
    await user.save();

    const res = await request(server)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'Customer'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('msg', 'User already exists');
  });

  // Test for updating a user by Admin
  it('should update a user when requested by an Admin', async () => {
    // Create a user and an admin in the test database
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpass', 10),
      role: 'Admin'
    });
    await admin.save();

    const user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Customer'
    });
    await user.save();

    // Create a session for the admin user
    const agent = request.agent(server); // Use agent to maintain the session

    // Log in as the admin
    await agent
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpass'
      });

    // Update the user
    const res = await agent
      .put(`/api/users/${user._id}`)
      .send({
        username: 'updateduser',
        email: 'updateduser@example.com',
        role: 'Customer'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'updateduser');
    expect(res.body).toHaveProperty('email', 'updateduser@example.com');
  });

  // Test for deleting a user by Admin
  it('should delete a user when requested by an Admin', async () => {
    // Create a user and an admin in the test database
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpass', 10),
      role: 'Admin'
    });
    await admin.save();

    const user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Customer'
    });
    await user.save();

    // Create a session for the admin user
    const agent = request.agent(server); // Use agent to maintain the session

    // Log in as the admin
    await agent
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpass'
      });

    // Delete the user
    const res = await agent
      .delete(`/api/users/${user._id}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('msg', 'User deleted successfully');
  });

  // Test for unauthorized user update attempt
  it('should not allow a non-admin to update a user', async () => {
    const user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Customer'
    });
    await user.save();

    const agent = request.agent(server);

    // Log in as the non-admin user
    await agent
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    const res = await agent
      .put(`/api/users/${user._id}`)
      .send({
        username: 'unauthorizeduser',
        email: 'unauthorizeduser@example.com',
        role: 'Customer'
      });

    expect(res.statusCode).toBe(403);  // Assuming you return a 403 status for unauthorized access
    expect(res.body).toHaveProperty('msg', 'Forbidden, Admins only.');
  });

  // Test for unauthorized user deletion attempt
  it('should not allow a non-admin to delete a user', async () => {
    const user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Customer'
    });
    await user.save();

    const agent = request.agent(server);

    // Log in as the non-admin user
    await agent
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    const res = await agent
      .delete(`/api/users/${user._id}`);

    expect(res.statusCode).toBe(403);  // Assuming you return a 403 status for unauthorized access
    expect(res.body).toHaveProperty('msg', 'Forbidden, Admins only.');
  });
});
