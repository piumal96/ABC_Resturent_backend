const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://kumararmjp:1AzuBp52TvRMhKjo@cluster0.kuhmhx3.mongodb.net/abc-restaurant?retryWrites=true&w=majority";

const connectDB = async () => {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return client;  // Return the client for reuse
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
