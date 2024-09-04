const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const connectDB = require('../config/db'); // Adjust the path as needed

jest.setTimeout(20000);  // Set longer timeout for MongoDB connections and teardown

describe('MongoDB Connection', () => {
  let mongoServer;
  const originalExit = process.exit; // Store original process.exit function

  beforeAll(async () => {
    // Ensure no active connections before starting new ones
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Start an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri(); // Set the MONGO_URI to point to the in-memory database
  });

  afterAll(async () => {
    // Stop the in-memory MongoDB server and close the mongoose connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(() => {
    // Mock process.exit to prevent it from stopping the test suite
    process.exit = jest.fn();
  });

  afterEach(async () => {
    // Restore original process.exit function after each test
    process.exit = originalExit;

    // Ensure the connection is properly closed between tests
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('should fail to connect to MongoDB with invalid URI', async () => {
    process.env.MONGO_URI = 'invalid_uri';  // Set an invalid URI
  
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
  
    try {
      await connectDB();
    } catch (error) {
      expect(error).toBeDefined(); // Expect an error to be thrown
    }
  
    expect(process.exit).toHaveBeenCalledWith(1); // Check that process.exit(1) was called
    expect(mongoose.connection.readyState).toBe(0); // 0 means disconnected
  
    consoleSpy.mockRestore(); // Restore console.error after test
  });
  
});
