const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const server = require('../server'); // Import the server, not just the app

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Disconnect any existing connections to ensure we're only using the in-memory server
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri);
});

afterEach(async () => {
  // Clear the Users collection after each test
  await User.deleteMany({});
});

afterAll(async () => {
  // Drop all collections, close the mongoose connection, and stop the in-memory server
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();  // Clear all documents in each collection
  }
  await mongoose.connection.close();
  await mongoServer.stop();
  await server.close(); // Ensure the server is closed after tests
});

describe('UserController - User Registration, Update, and Deletion', () => {
  // Test for registering a new user
  it('should register a new user', async () => {
    const res = await request(server)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'Customer'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
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
    expect(res.body).toHaveProperty('message', 'User already exists');  // Update to 'message'
  });

  // Test for updating a user by Admin
  it('should update a user when requested by an Admin', async () => {
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

    const agent = request.agent(server);

    await agent
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpass'
      });

    const res = await agent
      .put(`/api/users/${user._id}`)
      .send({
        username: 'updateduser',
        email: 'updateduser@example.com',
        role: 'Customer'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('username', 'updateduser');
    expect(res.body.user).toHaveProperty('email', 'updateduser@example.com');
  });

  // Test for deleting a user by Admin
  it('should delete a user when requested by an Admin', async () => {
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

    const agent = request.agent(server);

    await agent
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpass'
      });

    const res = await agent
      .delete(`/api/users/${user._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');  // Update to 'message'
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

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('msg', 'Forbidden, Admins only.');  // Update to 'message'
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

    await agent
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    const res = await agent
      .delete(`/api/users/${user._id}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('msg', 'Forbidden, Admins only.');  // Update to 'message'
  });
});
