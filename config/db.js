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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

module.exports = connectDB;
